import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./StockHeatmap.css";
import { getAllStocks } from "../services/stockService";

const StockHeatmap = ({ stocks = null }) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltip, setTooltip] = useState({
    data: null,
    visible: false,
    x: 0,
    y: 0,
  });
  const chartRef = useRef();
  const navigate = useNavigate();

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
        const processedStocks = stocksToProcess.map((stock: any) => ({
          change: stock.change,
          commentCount: stock.commentCount,
          currentPrice: stock.currentPrice,
          marketCap: stock.marketCap,
          name: stock.name,
          percentChange: stock.percentChange,
          sector: stock.sector,
          symbol: stock.symbol,
          volume: stock.volume
        }));

        // Filter out stocks that don't have required data
        const validStocks = processedStocks.filter(
          (stock: any) => stock.currentPrice &&
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

    const currentChartRef = chartRef.current;

    // Clear previous chart
    currentChartRef.innerHTML = "";

    // Create hierarchical data structure for D3 treemap
    const root = d3
      .hierarchy({
        children: stockData,
      })
      .sum((d: any) => d.marketCap) // Size by market cap
      .sort((a: any, b: any) => b.value - a.value);

    // Create treemap layout
    const treemap = d3
      .treemap()
      .size([920, 520]) // Available space within plot
      .padding(2)
      .round(true);

    treemap(root);

    // Extract positioned rectangles with original data
    const treemapData = root.leaves().map((d: any) => ({
      ...d.data,
      height: d.y1 - d.y0,
      width: d.x1 - d.x0,
      x0: d.x0,
      x1: d.x1,
      y0: d.y0,
      y1: d.y1
    }));

    const plot = Plot.plot({
      color: {
        domain: [0],
        label: "Price Change %",
        range: ["#e53e3e", "#38a169"],
        type: "threshold",
      },
      height: 600,
      marks: [
        // Create rectangles using D3 treemap positions
        Plot.rect(treemapData, {
          fill: "percentChange",
          rx: 3,
          stroke: "#333",
          strokeWidth: 1,
          x1: "x0",
          x2: "x1",
          y1: "y0",
          y2: "y1",
        }),

        // Add stock symbols (only if box is large enough)
        Plot.text(
          treemapData.filter((d: any) => d.width > 60 && d.height > 30),
          {
            fill: "rgba(255, 255, 255, 0.95)",
            fontSize: (d: any) => Math.min(14, Math.max(8, Math.min(d.width / 4, d.height / 3))),
            fontWeight: "bold",
            text: "symbol",
            textAnchor: "middle",
            x: (d: any) => (d.x0 + d.x1) / 2,
            y: (d: any) => (d.y0 + d.y1) / 2 - (d.height > 80 ? 20 : 8),
          }
        ),

        // Add company name (only for larger boxes)
        Plot.text(
          treemapData.filter((d: any) => d.width > 120 && d.height > 60),
          {
            fill: "rgba(255, 255, 255, 0.9)",
            fontSize: (d: any) => Math.min(10, Math.max(6, Math.min(d.width / 12, d.height / 8))),
            text: (d: any) => d.name.length > 20 ? d.name.substring(0, 17) + "..." : d.name,
            textAnchor: "middle",
            x: (d: any) => (d.x0 + d.x1) / 2,
            y: (d: any) => (d.y0 + d.y1) / 2 - 5,
          }
        ),

        // Add market cap (only for larger boxes)
        Plot.text(
          treemapData.filter((d: any) => d.width > 120 && d.height > 80),
          {
            fill: "rgba(255, 255, 255, 0.85)",
            fontSize: (d: any) => Math.min(9, Math.max(6, Math.min(d.width / 15, d.height / 10))),
            text: (d: any) => `$${(d.marketCap / 1000000000).toFixed(1)}B`,
            textAnchor: "middle",
            x: (d: any) => (d.x0 + d.x1) / 2,
            y: (d: any) => (d.y0 + d.y1) / 2 + 8,
          }
        ),

        // Add percentage change (only for medium+ boxes)
        Plot.text(
          treemapData.filter((d: any) => d.width > 80 && d.height > 50),
          {
            fill: "rgba(255, 255, 255, 0.95)",
            fontSize: (d: any) => Math.min(12, Math.max(6, Math.min(d.width / 8, d.height / 6))),
            fontWeight: "bold",
            text: (d: any) => `${d.percentChange >= 0 ? "+" : ""}${d.percentChange.toFixed(
              1
            )}%`,
            textAnchor: "middle",
            x: (d: any) => (d.x0 + d.x1) / 2,
            y: (d: any) => (d.y0 + d.y1) / 2 + (d.height > 80 ? 22 : 15),
          }
        ),
      ],
      padding: 40,
      style: {
        background: "#fafafa",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fontSize: "12px",
      },
      width: 1000,
      x: { axis: null },
      y: { axis: null },
    });

    currentChartRef.appendChild(plot);

    // Add custom tooltip event listeners
    const rects = currentChartRef.querySelectorAll("rect");
    rects.forEach((rect: any, index: any) => {
      const stockData = treemapData[index];
      if (stockData) {
        rect.style.cursor = "pointer";

        rect.addEventListener("mouseenter", (e: any) => {
          setTooltip({
            data: stockData,
            visible: true,
            x: e.clientX,
            y: e.clientY,
          });
        });

        rect.addEventListener("mousemove", (e: any) => {
          setTooltip((prev) => ({
            ...prev,
            x: e.clientX,
            y: e.clientY,
          }));
        });

        rect.addEventListener("mouseleave", () => {
          setTooltip({ data: null, visible: false, x: 0, y: 0 });
        });

        rect.addEventListener("click", () => {
          navigate(`/stocks/${stockData.symbol}`);
        });
      }
    });

    // Cleanup function
    return () => {
      if (currentChartRef) {
        currentChartRef.innerHTML = "";
      }
      setTooltip({ data: null, visible: false, x: 0, y: 0 });
    };
  }, [stockData, navigate]);

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
        className="heatmap-container"
        ref={chartRef}
        style={{
          backgroundColor: "#fff",
          border: "1px solid #dee2e6",
          borderRadius: "8px",
          overflowX: "auto",
          width: "100%",
        }}
      />

      {/* Custom Tooltip Modal */}
      {tooltip.visible && tooltip.data && (
        <div
          className="heatmap-tooltip"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            color: "#1a1a1a",
            fontFamily:
              "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fontSize: "14px",
            left: `${tooltip.x}px`,
            lineHeight: "1.5",
            padding: "12px",
            pointerEvents: "none",
            position: "fixed",
            top: `${tooltip.y}px`,
            transform: "translate(8px, -50%)",
            whiteSpace: "nowrap",
            zIndex: 1000,
          }}
        >
          <div
            style={{ color: "#000", fontWeight: "600", marginBottom: "8px" }}
          >
            {tooltip.data.name} ({tooltip.data.symbol})
          </div>
          <div style={{ color: "#2c2c2c", marginBottom: "4px" }}>
            Market Cap: ${(tooltip.data.marketCap / 1000000000).toFixed(1)}B
          </div>
          <div
            style={{
              color: tooltip.data.percentChange >= 0 ? "#00a152" : "#d32f2f",
              marginBottom: "4px",
            }}
          >
            Day Return: {tooltip.data.percentChange >= 0 ? "+" : ""}
            {tooltip.data.percentChange.toFixed(2)}%
          </div>
          <div style={{ color: "#2c2c2c" }}>
            Current Price: ${tooltip.data.currentPrice.toFixed(2)}
          </div>
        </div>
      )}

      {stockData.length > 0 && (
        <div className="mt-3">
          <small className="text-muted">
            Showing {stockData.length} stocks
          </small>
        </div>
      )}
    </div>
  );
};

export default StockHeatmap;
