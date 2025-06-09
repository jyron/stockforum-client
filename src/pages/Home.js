import React, { useState, useEffect } from "react";
import StockTable from "../components/StockTable";
import StockHeatmap from "../components/StockHeatmap";
import SectorFilter from "../components/SectorFilter";
import ConversationList from "../components/ConversationList";
import LoadingBar from "../components/LoadingBar";
import { getAllConversations } from "../services/conversationService";
import "../styles/Craigslist.css";
import "../styles/components.css";
import { Link } from "react-router-dom";

const Home = ({ stocks, isLoading, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "gainers", "losers"
  const [selectedSector, setSelectedSector] = useState("");
  const [viewMode, setViewMode] = useState("table"); // "table", "heatmap", or "conversations"
  const [conversations, setConversations] = useState([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [error, setError] = useState(null);

  // Fetch conversations when viewMode changes to "conversations"
  useEffect(() => {
    if (viewMode === "conversations") {
      fetchConversations();
    }
  }, [viewMode]);

  const fetchConversations = async () => {
    setIsLoadingConversations(true);
    setError(null);
    const result = await getAllConversations();
    if (result.success) {
      setConversations(result.data);
    } else {
      setError(result.error);
    }
    setIsLoadingConversations(false);
  };

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

  // Filter stocks
  let filteredStocks = stocks.filter(
    (stock) =>
      (stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedSector || stock.sector === selectedSector)
  );

  // Filter conversations
  const filteredConversations = conversations?.filter((conversation) =>
    conversation.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          placeholder={
            viewMode === "conversations"
              ? "Search conversations..."
              : "Search stocks..."
          }
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        {viewMode !== "conversations" && (
          <SectorFilter
            selectedSector={selectedSector}
            onSectorChange={handleSectorChange}
          />
        )}
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
          <button
            className={`view-tab ${
              viewMode === "conversations" ? "active" : ""
            }`}
            onClick={() => handleViewModeChange("conversations")}
          >
            💬 Conversations
          </button>
        </div>

        {viewMode !== "conversations" && (
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
        )}
      </div>

      {viewMode === "conversations" ? (
        <div className="conversations-section">
          <div className="conversations-header">
            <h2>Recent Conversations</h2>
            <Link to="/new-conversation" className="new-conversation-button">
              Start New Conversation
            </Link>
          </div>
          {error && <div className="error-message">{error}</div>}
          {isLoadingConversations ? (
            <LoadingBar />
          ) : (
            <ConversationList conversations={filteredConversations || []} />
          )}
        </div>
      ) : viewMode === "heatmap" ? (
        <StockHeatmap stocks={filteredStocks} />
      ) : (
        <StockTable stocks={filteredStocks} onUpdate={onUpdate} />
      )}
    </div>
  );
};

export default Home;
