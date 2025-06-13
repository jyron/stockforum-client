import React, { useState, useEffect } from "react";
import StockTable from "../components/StockTable";
import StockHeatmap from "../components/StockHeatmap";
import SectorFilter from "../components/SectorFilter";
import ConversationList from "../components/ConversationList";
import LoadingBar from "../components/LoadingBar";
import ArticlesSection from "../components/ArticlesSection";
import NewsSection from "../components/NewsSection";
import { getAllConversations } from "../services/conversationService";
import "../styles/Craigslist.css";
import "../styles/components.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = ({ stocks, isLoading, onUpdate }) => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "gainers", "losers"
  const [selectedSector, setSelectedSector] = useState("");
  const [viewMode, setViewMode] = useState("table"); // "table", "heatmap", or "conversations"
  const [conversations, setConversations] = useState([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [error, setError] = useState(null);
  const [topMoversFilter, setTopMoversFilter] = useState("all"); // "all", "gainers", "losers"

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

  // Get top movers based on filter
  const getTopMovers = () => {
    let filteredStocks = [...stocks];

    if (topMoversFilter === "gainers") {
      filteredStocks = filteredStocks
        .filter((stock) => stock.percentChange > 0)
        .sort((a, b) => b.percentChange - a.percentChange);
    } else if (topMoversFilter === "losers") {
      filteredStocks = filteredStocks
        .filter((stock) => stock.percentChange < 0)
        .sort((a, b) => a.percentChange - b.percentChange);
    } else {
      // Show top movers by absolute change
      filteredStocks = filteredStocks.sort(
        (a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange)
      );
    }

    return filteredStocks.slice(0, 5);
  };

  const topMovers = getTopMovers();

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

      <div className="three-column-layout">
        <div className="left-sidebar">
          <div className="top-movers-section">
            <h3>Top Movers</h3>

            {/* Top Movers Filter Tabs */}
            <div className="top-movers-tabs">
              <button
                className={`top-mover-tab ${
                  topMoversFilter === "all" ? "active" : ""
                }`}
                onClick={() => setTopMoversFilter("all")}
              >
                All
              </button>
              <button
                className={`top-mover-tab ${
                  topMoversFilter === "gainers" ? "active" : ""
                }`}
                onClick={() => setTopMoversFilter("gainers")}
              >
                Gainers
              </button>
              <button
                className={`top-mover-tab ${
                  topMoversFilter === "losers" ? "active" : ""
                }`}
                onClick={() => setTopMoversFilter("losers")}
              >
                Losers
              </button>
            </div>

            <div className="top-movers-list">
              {topMovers.length > 0 ? (
                topMovers.map((stock) => (
                  <Link
                    to={`/stocks/${stock.symbol}`}
                    key={stock.symbol}
                    className="top-mover-item"
                  >
                    <div className="mover-symbol">{stock.symbol}</div>
                    <div className="mover-name">{stock.name}</div>
                    <div
                      className={`mover-change ${
                        stock.percentChange >= 0 ? "positive" : "negative"
                      }`}
                    >
                      {stock.percentChange >= 0 ? "+" : ""}
                      {stock.percentChange?.toFixed(2)}%
                    </div>
                    <div className="mover-price">
                      ${stock.currentPrice?.toFixed(2)}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="no-movers">
                  No{" "}
                  {topMoversFilter === "gainers"
                    ? "gainers"
                    : topMoversFilter === "losers"
                    ? "losers"
                    : "movers"}{" "}
                  available
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="main-content">
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
                  className={`filter-tab ${
                    activeFilter === "all" ? "active" : ""
                  }`}
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
                {isAuthenticated() && (
                  <Link
                    to="/new-conversation"
                    className="new-conversation-button"
                  >
                    Start New Conversation
                  </Link>
                )}
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

        <div className="right-sidebar">
          <ArticlesSection />
        </div>
      </div>

      <NewsSection />
    </div>
  );
};

export default Home;
