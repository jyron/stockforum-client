import React, { useEffect, useState, useRef } from "react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { getAllStocks } from "../services/stockService";
import "./StockHeatmap.css";

const StockHeatmap = ({ stocks = null }) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    data: null,
    x: 0,
    y: 0,
  });
  const chartRef = useRef();

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        setError(null);

        let stocksToProcess = stocks;

        // If no stocks provided, fetch all stocks from database
        if (!stocks) {
          const response = await getAllStocks();
          if (!response.success) {
            throw new Error(response.error || "Failed to fetch stocks");
          }
          stocksToProcess = response.data;
        }

        if (!stocksToProcess || stocksToProcess.length === 0) {
          throw new Error("No stock data available");
        }

        // Process stock data for heatmap - only use actual fields from stock model
        const processedStocks = stocksToProcess.map((stock) => ({
          symbol: stock.symbol,
          name: stock.name,
          currentPrice: stock.currentPrice,
          change: stock.change,
          percentChange: stock.percentChange,
          marketCap: stock.marketCap,
          volume: stock.volume,
          sector: stock.sector,
          commentCount: stock.commentCount,
        }));

        // Filter out stocks that don't have required data
        const validStocks = processedStocks.filter(
          (stock) =>
            stock.currentPrice &&
            stock.marketCap &&
            stock.percentChange !== undefined
        );

        if (validStocks.length === 0) {
          throw new Error(
            "No stocks found with required data (currentPrice, marketCap, percentChange)"
          );
        }

        setStockData(validStocks);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching stock data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [stocks]);

  useEffect(() => {
    if (!stockData.length || !chartRef.current) return;

    // Clear previous chart
    chartRef.current.innerHTML = "";

    // Calculate data ranges for color scale
    const maxAbsChange = Math.max(
      ...stockData.map((d) => Math.abs(d.percentChange))
    );

    // Create hierarchical data structure for D3 treemap
    const root = d3
      .hierarchy({
        children: stockData,
      })
      .sum((d) => d.marketCap) // Size by market cap
      .sort((a, b) => b.value - a.value);

    // Create treemap layout
    const treemap = d3
      .treemap()
      .size([920, 520]) // Available space within plot
      .padding(2)
      .round(true);

    treemap(root);

    // Extract positioned rectangles with original data
    const treemapData = root.leaves().map((d) => ({
      ...d.data,
      x0: d.x0,
      y0: d.y0,
      x1: d.x1,
      y1: d.y1,
      width: d.x1 - d.x0,
      height: d.y1 - d.y0,
    }));

    const plot = Plot.plot({
      title: "Stock Market Heatmap",
      subtitle: "Box size = Market Cap, Color = Price Change %",
      width: 1000,
      height: 600,
      padding: 40,
      style: {
        fontSize: "12px",
        fontFamily: "system-ui, sans-serif",
        background: "#fafafa",
      },
      color: {
        type: "diverging",
        domain: [-Math.max(5, maxAbsChange), 0, Math.max(5, maxAbsChange)],
        range: ["#d32f2f", "#f5f5f5", "#388e3c"],
        label: "Price Change %",
      },
      marks: [
        // Create rectangles using D3 treemap positions
        Plot.rect(treemapData, {
          x1: "x0",
          y1: "y0",
          x2: "x1",
          y2: "y1",
          fill: "percentChange",
          stroke: "#333",
          strokeWidth: 1,
          rx: 3,
        }),

        // Add stock symbols (only if box is large enough)
        Plot.text(
          treemapData.filter((d) => d.width > 60 && d.height > 30),
          {
            x: (d) => (d.x0 + d.x1) / 2,
            y: (d) => (d.y0 + d.y1) / 2 - (d.height > 80 ? 20 : 8),
            text: "symbol",
            fill: (d) => (Math.abs(d.percentChange) > 3 ? "white" : "black"),
            fontSize: (d) =>
              Math.min(14, Math.max(8, Math.min(d.width / 4, d.height / 3))),
            fontWeight: "bold",
            textAnchor: "middle",
          }
        ),

        // Add company name (only for larger boxes)
        Plot.text(
          treemapData.filter((d) => d.width > 120 && d.height > 60),
          {
            x: (d) => (d.x0 + d.x1) / 2,
            y: (d) => (d.y0 + d.y1) / 2 - 5,
            text: (d) =>
              d.name.length > 20 ? d.name.substring(0, 17) + "..." : d.name,
            fill: (d) => (Math.abs(d.percentChange) > 3 ? "white" : "#333"),
            fontSize: (d) =>
              Math.min(10, Math.max(6, Math.min(d.width / 12, d.height / 8))),
            textAnchor: "middle",
          }
        ),

        // Add market cap (only for larger boxes)
        Plot.text(
          treemapData.filter((d) => d.width > 120 && d.height > 80),
          {
            x: (d) => (d.x0 + d.x1) / 2,
            y: (d) => (d.y0 + d.y1) / 2 + 8,
            text: (d) => `$${(d.marketCap / 1000000000).toFixed(1)}B`,
            fill: (d) => (Math.abs(d.percentChange) > 3 ? "white" : "#666"),
            fontSize: (d) =>
              Math.min(9, Math.max(6, Math.min(d.width / 15, d.height / 10))),
            textAnchor: "middle",
          }
        ),

        // Add percentage change (only for medium+ boxes)
        Plot.text(
          treemapData.filter((d) => d.width > 80 && d.height > 50),
          {
            x: (d) => (d.x0 + d.x1) / 2,
            y: (d) => (d.y0 + d.y1) / 2 + (d.height > 80 ? 22 : 15),
            text: (d) =>
              `${d.percentChange >= 0 ? "+" : ""}${d.percentChange.toFixed(
                1
              )}%`,
            fill: (d) => (Math.abs(d.percentChange) > 3 ? "white" : "#333"),
            fontSize: (d) =>
              Math.min(12, Math.max(6, Math.min(d.width / 8, d.height / 6))),
            fontWeight: "bold",
            textAnchor: "middle",
          }
        ),
      ],
    });

    chartRef.current.appendChild(plot);

    // Add custom tooltip event listeners
    const rects = chartRef.current.querySelectorAll("rect");
    rects.forEach((rect, index) => {
      const stockData = treemapData[index];
      if (stockData) {
        rect.style.cursor = "pointer";

        rect.addEventListener("mouseenter", (e) => {
          setTooltip({
            visible: true,
            data: stockData,
            x: e.pageX + 10,
            y: e.pageY - 10,
          });
        });

        rect.addEventListener("mousemove", (e) => {
          setTooltip((prev) => ({
            ...prev,
            x: e.pageX + 10,
            y: e.pageY - 10,
          }));
        });

        rect.addEventListener("mouseleave", () => {
          setTooltip({ visible: false, data: null, x: 0, y: 0 });
        });
      }
    });

    // Cleanup function
    return () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }
      setTooltip({ visible: false, data: null, x: 0, y: 0 });
    };
  }, [stockData]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading heatmap...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h5>Error loading stock heatmap</h5>
        <p>{error}</p>
        <small className="text-muted">
          Please check your database connection and try again.
        </small>
      </div>
    );
  }

  return (
    <div className="stock-heatmap">
      <div className="mb-3">
        <h4>Stock Market Heatmap</h4>
        <p className="text-muted">
          Box size represents company market cap, color represents price change.
          Larger boxes = bigger companies. Green = gains, red = losses.
        </p>
      </div>

      <div className="legend mb-3">
        <div className="legend-item">
          <div className="legend-color legend-negative"></div>
          <span>Losses</span>
        </div>
        <div className="legend-item">
          <div className="legend-color legend-neutral"></div>
          <span>Neutral</span>
        </div>
        <div className="legend-item">
          <div className="legend-color legend-positive"></div>
          <span>Gains</span>
        </div>
      </div>

      <div
        ref={chartRef}
        className="heatmap-container"
        style={{
          width: "100%",
          overflowX: "auto",
          border: "1px solid #dee2e6",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      />

      {/* Custom Tooltip Modal */}
      {tooltip.visible && tooltip.data && (
        <div
          className="heatmap-tooltip"
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y,
            backgroundColor: "#333",
            color: "white",
            padding: "12px",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            fontSize: "13px",
            lineHeight: "1.4",
            zIndex: 1000,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
            {tooltip.data.name} ({tooltip.data.symbol})
          </div>
          <div>
            Market Cap: ${(tooltip.data.marketCap / 1000000000).toFixed(1)}B
          </div>
          <div>
            Day Return: {tooltip.data.percentChange >= 0 ? "+" : ""}
            {tooltip.data.percentChange.toFixed(2)}%
          </div>
          <div>Current Price: ${tooltip.data.currentPrice.toFixed(2)}</div>
        </div>
      )}

      {stockData.length > 0 && (
        <div className="mt-3">
          <small className="text-muted">
            Last updated: {new Date().toLocaleTimeString()} | Showing{" "}
            {stockData.length} stocks from your database
          </small>
        </div>
      )}
    </div>
  );
};

export default StockHeatmap;
