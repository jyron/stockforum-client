import React, { useState } from "react";
import StockTable from "../components/StockTable";
import "../styles/Craigslist.css";
import "../styles/components.css";

const Home = ({ stocks, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "gainers", or "losers"

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // First filter by search term
  let filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Then filter by tab selection
  if (activeTab === "gainers") {
    filteredStocks = filteredStocks
      .filter((stock) => stock.percentChange > 0)
      .sort((a, b) => b.percentChange - a.percentChange);
  } else if (activeTab === "losers") {
    filteredStocks = filteredStocks
      .filter((stock) => stock.percentChange < 0)
      .sort((a, b) => a.percentChange - b.percentChange);
  }

  return (
    <div className="home-container">
      <header className="main-header">
        <div className="header-content">
          <img
            src="/logo192.png"
            alt="StockForum Logo"
            className="header-logo"
          />
          <div>
            <h1>stock forum | discussions</h1>
            <p className="tagline">discuss stocks with the community</p>
          </div>
        </div>
      </header>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="AAPL, GOOGL..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => handleTabChange("all")}
        >
          All Stocks
        </button>
        <button
          className={`tab-button ${activeTab === "gainers" ? "active" : ""}`}
          onClick={() => handleTabChange("gainers")}
        >
          Top Gainers
        </button>
        <button
          className={`tab-button ${activeTab === "losers" ? "active" : ""}`}
          onClick={() => handleTabChange("losers")}
        >
          Top Losers
        </button>
      </div>

      {filteredStocks.length === 0 ? (
        <div className="no-stocks">
          No stocks found matching your search criteria.
        </div>
      ) : (
        <StockTable stocks={filteredStocks} onUpdate={onUpdate} />
      )}
    </div>
  );
};

export default Home;
