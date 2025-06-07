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
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = ({ symbol }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        // Get dates for the last 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

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

        setChartData({
          labels: sortedData.map((item) => item.date),
          datasets: [
            {
              label: `${symbol} Price`,
              data: sortedData.map((item) => item.price),
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              tension: 0.1,
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

    console.log("API Key available:", !!process.env.REACT_APP_FMP_API_URL);
  }, [symbol]);

  if (loading) {
    return <div>Loading chart...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger">Error loading chart: {error}</div>
    );
  }

  if (!chartData) {
    return null;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${symbol} Stock Price History`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value) {
            return "$" + value.toFixed(2);
          },
        },
      },
    },
  };

  return (
    <div className="stock-chart">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockChart;
