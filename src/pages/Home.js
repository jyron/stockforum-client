import React, { useState } from "react";
import StockTable from "../components/StockTable";
import StockHeatmap from "../components/StockHeatmap";
import SectorFilter from "../components/SectorFilter";
import LoadingBar from "../components/LoadingBar";
import "../styles/Craigslist.css";
import "../styles/components.css";

const Home = ({ stocks, isLoading, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "gainers", "losers"
  const [selectedSector, setSelectedSector] = useState("");
  const [viewMode, setViewMode] = useState("table"); // "table" or "heatmap"

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleSectorChange = (sector) => {
    setSelectedSector(sector);
  };

  // First filter by search term and sector
  let filteredStocks = stocks.filter(
    (stock) =>
      (stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedSector || stock.sector === selectedSector)
  );

  // Then filter by selection
  if (activeFilter === "gainers") {
    filteredStocks = filteredStocks
      .filter((stock) => stock.percentChange > 0)
      .sort((a, b) => b.percentChange - a.percentChange);
  } else if (activeFilter === "losers") {
    filteredStocks = filteredStocks
      .filter((stock) => stock.percentChange < 0)
      .sort((a, b) => a.percentChange - b.percentChange);
  }

  if (isLoading) {
    return (
      <div className="home-container">
        <LoadingBar />
      </div>
    );
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

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <SectorFilter
          selectedSector={selectedSector}
          onSectorChange={handleSectorChange}
        />
      </div>

      <div className="view-controls">
        {/* View Mode Tabs */}
        <div className="view-tabs">
          <button
            className={`view-tab ${viewMode === "table" ? "active" : ""}`}
            onClick={() => handleViewModeChange("table")}
          >
            📊 Table View
          </button>
          <button
            className={`view-tab ${viewMode === "heatmap" ? "active" : ""}`}
            onClick={() => handleViewModeChange("heatmap")}
          >
            🗂️ Heatmap View
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilterChange("all")}
          >
            All Stocks
          </button>
          <button
            className={`filter-tab ${
              activeFilter === "gainers" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("gainers")}
          >
            Top Gainers
          </button>
          <button
            className={`filter-tab ${
              activeFilter === "losers" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("losers")}
          >
            Top Losers
          </button>
        </div>
      </div>

      {filteredStocks.length === 0 ? null : viewMode === "heatmap" ? (
        <StockHeatmap stocks={filteredStocks} />
      ) : (
        <StockTable stocks={filteredStocks} onUpdate={onUpdate} />
      )}
    </div>
  );
};

export default Home;
