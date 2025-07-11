import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllPortfolios, votePortfolio } from "../services/portfolioService";
import "../styles/components.css";
import "./RateMyPortfolio.css";
import AuthModal from "../components/AuthModal";
import PortfolioUploadModal from "../components/PortfolioUploadModal";

const PAGE_SIZE = 10;

const RateMyPortfolio = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("hot");
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [voteLoading, setVoteLoading] = useState({}); // { [portfolioId]: true/false }
  const [voteError, setVoteError] = useState({}); // { [portfolioId]: errorMsg }
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");

  const fetchPortfolios = async (sort = activeTab, pageNum = page) => {
    setLoading(true);
    setError("");
    try {
      const result = await getAllPortfolios("", sort, pageNum, PAGE_SIZE);
      if (result.success) {
        setPortfolios(result.data.portfolios || []);
        setPagination(
          result.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalCount: 0,
            hasNextPage: false,
          }
        );
      } else {
        setError(result.error || "Failed to load portfolios");
      }
    } catch (err) {
      setError("Error loading portfolios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios(activeTab, 1);
    setPage(1);
    // eslint-disable-next-line
  }, [activeTab]);

  useEffect(() => {
    fetchPortfolios(activeTab, page);
    // eslint-disable-next-line
  }, [page]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleVote = async (portfolioId, voteType) => {
    if (!isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }
    setVoteLoading((prev) => ({ ...prev, [portfolioId]: true }));
    setVoteError((prev) => ({ ...prev, [portfolioId]: "" }));
    try {
      const result = await votePortfolio(portfolioId, voteType);
      if (result.success) {
        setPortfolios((prevPortfolios) =>
          prevPortfolios.map((p) =>
            p._id === portfolioId
              ? {
                  ...p,
                  upvotes: result.data.upvotes,
                  downvotes: result.data.downvotes,
                  // Optionally, you can add userVote: result.data.userVote
                }
              : p
          )
        );
      } else {
        setVoteError((prev) => ({
          ...prev,
          [portfolioId]: result.error || "Failed to vote",
        }));
      }
    } catch (err) {
      setVoteError((prev) => ({ ...prev, [portfolioId]: "Error voting" }));
    } finally {
      setVoteLoading((prev) => ({ ...prev, [portfolioId]: false }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffInDays < 1) {
      return "Today";
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getPerformanceClass = (performance) => {
    if (performance?.startsWith("+")) return "positive";
    if (performance?.startsWith("-")) return "negative";
    return "neutral";
  };

  const getCategoryColor = (category) => {
    const colors = {
      YOLO: "#ff6b35",
      LOSSES: "#ff4444",
      BOOMER: "#4a90e2",
      GAINS: "#00ff88",
      CRYPTO: "#f7931e",
      OPTIONS: "#a259ff",
      OTHER: "#666",
    };
    return colors[category] || "#666";
  };

  // Pagination controls
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (pagination.hasNextPage) setPage(page + 1);
  };

  const handleOpenUpload = () => {
    if (!isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }
    setShowUploadModal(true);
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    setUploadSuccess("Portfolio uploaded successfully!");
    fetchPortfolios(activeTab, 1);
    setPage(1);
    setTimeout(() => setUploadSuccess(""), 4000);
  };

  return (
    <div className="rate-portfolio-container">
      <header className="portfolio-header">
        <div className="header-content">
          <h1>📈 Rate My Portfolio</h1>
          <p className="tagline">
            Share your portfolio and get feedback from the community
          </p>
        </div>
        {/* Sorting Tabs */}
        <div className="portfolio-tabs">
          <button
            className={`tab ${activeTab === "hot" ? "active" : ""}`}
            onClick={() => handleTabChange("hot")}
          >
            🔥 Hot
          </button>
          <button
            className={`tab ${activeTab === "new" ? "active" : ""}`}
            onClick={() => handleTabChange("new")}
          >
            🆕 New
          </button>
          <button
            className={`tab ${activeTab === "top" ? "active" : ""}`}
            onClick={() => handleTabChange("top")}
          >
            👑 Top This Week
          </button>
          <button
            className={`tab ${activeTab === "controversial" ? "active" : ""}`}
            onClick={() => handleTabChange("controversial")}
          >
            💀 Most Controversial
          </button>
        </div>
        {/* Upload Section */}
        <div className="upload-section">
          <button className="upload-btn" onClick={handleOpenUpload}>
            📸 Upload Your Portfolio
          </button>
          <p className="upload-note">
            Get roasted by the community • Anonymous posting available
            {isAuthenticated() && " with Premium"}
          </p>
        </div>
      </header>
      {/* Loading/Error States */}
      {loading && <div className="loading">Loading portfolios...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action="vote on portfolios"
      />
      {uploadSuccess && (
        <div className="alert alert-success">{uploadSuccess}</div>
      )}
      <PortfolioUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />
      {/* Portfolio Grid */}
      {!loading && !error && (
        <div className="portfolio-grid">
          {portfolios.map((portfolio) => (
            <article key={portfolio._id} className="portfolio-card">
              <Link
                to={`/portfolio/${portfolio._id}`}
                className="portfolio-link"
              >
                <div className="portfolio-thumbnail">
                  <img
                    src={portfolio.thumbnailUrl || portfolio.imageUrl}
                    alt={portfolio.title}
                  />
                  <div
                    className={`performance-overlay ${getPerformanceClass(
                      portfolio.performance
                    )}`}
                  >
                    <span className="performance-text">
                      {portfolio.performance}
                    </span>
                  </div>
                  {portfolio.isPremium && (
                    <div className="premium-badge">PRO</div>
                  )}
                </div>
                <div className="portfolio-info">
                  <div className="portfolio-title-section">
                    <h3 className="portfolio-title">{portfolio.title}</h3>
                    <div
                      className="category-tag"
                      style={{
                        backgroundColor: getCategoryColor(portfolio.category),
                      }}
                    >
                      {portfolio.category}
                    </div>
                  </div>
                  <div className="portfolio-meta">
                    <div className="author-info">
                      <span className="author-name">
                        {portfolio.author?.username || "Anonymous"}
                      </span>
                      <span className="post-date">
                        {formatDate(portfolio.createdAt)}
                      </span>
                    </div>
                    <div className="portfolio-stats">
                      <div className="vote-section">
                        <button
                          className={`vote-btn upvote`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleVote(portfolio._id, "upvote");
                          }}
                          title="Upvote"
                          disabled={voteLoading[portfolio._id]}
                        >
                          ▲
                        </button>
                        <span className="vote-count">
                          {portfolio.upvotes - portfolio.downvotes}
                        </span>
                        <button
                          className={`vote-btn downvote`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleVote(portfolio._id, "downvote");
                          }}
                          title="Downvote"
                          disabled={voteLoading[portfolio._id]}
                        >
                          ▼
                        </button>
                        {voteError[portfolio._id] && (
                          <span className="vote-error">
                            {voteError[portfolio._id]}
                          </span>
                        )}
                      </div>
                      <div className="comments-info">
                        <span className="comments-icon">💬</span>
                        <span className="comments-count">
                          {portfolio.commentCount}
                        </span>
                        <span className="comments-label">
                          {portfolio.commentCount === 1
                            ? "comment"
                            : "comments"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
      {/* Empty State (if no portfolios) */}
      {!loading && !error && portfolios.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No portfolios found</h3>
          <p>Be the first to share your portfolio with the community!</p>
          <button className="upload-btn" onClick={handleOpenUpload}>
            Upload Your Portfolio
          </button>
        </div>
      )}
      {/* Pagination Controls */}
      {!loading && !error && pagination.totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={page === 1}>
            Previous
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button onClick={handleNextPage} disabled={!pagination.hasNextPage}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RateMyPortfolio;
