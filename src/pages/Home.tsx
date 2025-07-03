import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ArticlesSection from "../components/ArticlesSection";
import ConversationList from "../components/ConversationList";
import LoadingBar from "../components/LoadingBar";
import NewsSection from "../components/NewsSection";
import SectorFilter from "../components/SectorFilter";
import StockHeatmap from "../components/StockHeatmap";
import "../styles/Craigslist.css";
import "../styles/components.css";
import StockTable from "../components/StockTable";
import { useAuth } from "../context/AuthContext";
import { getAllConversations } from "../services/conversationService";

const Home = ({
  isLoading,
  onUpdate,
  stocks
}: any) => {
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

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter: any) => {
    setActiveFilter(filter);
  };

  const handleViewModeChange = (mode: any) => {
    setViewMode(mode);
  };

  const handleSectorChange = (sector: any) => {
    setSelectedSector(sector);
  };

  // Filter stocks
  let filteredStocks = stocks.filter(
    (stock: any) => (stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!selectedSector || stock.sector === selectedSector)
  );

  // Filter conversations
  const filteredConversations = conversations?.filter((conversation) =>
    conversation.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (activeFilter === "gainers") {
    filteredStocks = filteredStocks
      .filter((stock: any) => stock.percentChange > 0)
      .sort((a: any, b: any) => b.percentChange - a.percentChange);
  } else if (activeFilter === "losers") {
    filteredStocks = filteredStocks
      .filter((stock: any) => stock.percentChange < 0)
      .sort((a: any, b: any) => a.percentChange - b.percentChange);
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
            alt="StockForum Logo"
            className="header-logo"
            src="/logo192.png"
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
                    className="top-mover-item"
                    key={stock.symbol}
                    to={`/stocks/${stock.symbol}`}
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
              className="search-input"
              onChange={handleSearch}
              placeholder={
                viewMode === "conversations"
                  ? "Search conversations..."
                  : "Search stocks..."
              }
              type="text"
              value={searchTerm}
            />
            {viewMode !== "conversations" && (
              <SectorFilter
                onSectorChange={handleSectorChange}
                selectedSector={selectedSector}
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
                    className="new-conversation-button"
                    to="/new-conversation"
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
            <StockTable onUpdate={onUpdate} stocks={filteredStocks} />
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
