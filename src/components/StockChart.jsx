import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart';
import "./StockChart.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ symbol }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        // Get dates for the specified time range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - timeRange);

        const response = await fetch(
          `https://financialmodelingprep.com/stable/historical-price-eod/light?symbol=${symbol}&from=${
            startDate.toISOString().split("T")[0]
          }&to=${endDate.toISOString().split("T")[0]}&apikey=${
            process.env.REACT_APP_FMP_API_URL
          }`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }

        const data = await response.json();

        // Sort data by date in ascending order
        const sortedData = data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        // Calculate price change for color gradient
        const prices = sortedData.map((item) => item.price);
        const isUptrend = prices[prices.length - 1] > prices[0];

        setChartData({
          labels: sortedData.map((item) => {
            const date = new Date(item.date);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }),
          datasets: [
            {
              label: `${symbol} Price`,
              data: sortedData.map((item) => item.price),
              borderColor: isUptrend ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)",
              backgroundColor: isUptrend
                ? "rgba(34, 197, 94, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
              tension: 0.3,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: isUptrend
                ? "rgb(34, 197, 94)"
                : "rgb(239, 68, 68)",
              pointHoverBorderColor: "#fff",
              pointHoverBorderWidth: 2,
              fill: true,
              borderWidth: 2,
            },
          ],
        });
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchChartData();
    }
  }, [symbol, timeRange]);

  if (loading) {
    return <div className="chart-loading">Loading chart...</div>;
  }

  if (error) {
    return (
      <div className="chart-error">
        <span>⚠️ Error loading chart: {error}</span>
      </div>
    );
  }

  if (!chartData) {
    return null;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${symbol} Stock Price History`,
        color: "#374151",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function (context) {
            return `Date: ${context[0].label}`;
          },
          label: function (context) {
            const price = context.parsed.y;
            return `Price: $${price.toFixed(2)}`;
          },
          afterLabel: function (context) {
            const dataIndex = context.dataIndex;
            const data = context.dataset.data;

            if (dataIndex > 0) {
              const currentPrice = data[dataIndex];
              const previousPrice = data[dataIndex - 1];
              const change = currentPrice - previousPrice;
              const changePercent = (change / previousPrice) * 100;

              const changeText = change >= 0 ? "+" : "";
              return [
                `Change: ${changeText}$${change.toFixed(2)}`,
                `Change %: ${changeText}${changePercent.toFixed(2)}%`,
              ];
            }
            return "";
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 6,
          color: "#6B7280",
        },
      },
      y: {
        position: "right",
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value) {
            return "$" + value.toFixed(2);
          },
          color: "#6B7280",
        },
      },
    },
    elements: {
      point: {
        hoverRadius: 8,
      },
    },
  };

  return (
    <div className="stock-chart-container">
      <div className="chart-controls">
        <div className="time-range-buttons">
          {[7, 30, 90, 180].map((days) => (
            <button
              key={days}
              className={`time-btn ${timeRange === days ? "active" : ""}`}
              onClick={() => setTimeRange(days)}
            >
              {days === 7
                ? "1W"
                : days === 30
                ? "1M"
                : days === 90
                ? "3M"
                : "6M"}
            </button>
          ))}
        </div>
      </div>
      <div className="stock-chart">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StockChart;
