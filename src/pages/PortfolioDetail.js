import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getPortfolioById,
  getPortfolioComments,
  votePortfolio,
} from "../services/portfolioService";
import { useAuth } from "../context/AuthContext";
import PortfolioComment from "../components/PortfolioComment";
import PortfolioCommentForm from "../components/PortfolioCommentForm";
import "./StockDetail.css";

const PortfolioDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [voteLoading, setVoteLoading] = useState(false);
  const [voteError, setVoteError] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(true);

  const fetchPortfolio = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getPortfolioById(id);
      if (result.success) {
        setPortfolio(result.data);
      } else {
        setError(result.error || "Portfolio not found");
      }
    } catch (err) {
      setError("Error fetching portfolio details");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!id) return;
    setCommentsLoading(true);
    try {
      const result = await getPortfolioComments(id);
      if (result.success) {
        setComments(
          result.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      }
    } catch (err) {
      // Ignore for now
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchComments();
    // eslint-disable-next-line
  }, [id]);

  const handleVote = async (voteType) => {
    if (!isAuthenticated()) {
      alert("Please login to vote on portfolios");
      return;
    }
    if (!portfolio || !portfolio._id) {
      setVoteError("Cannot vote on this portfolio right now");
      return;
    }
    setVoteLoading(true);
    setVoteError("");
    const result = await votePortfolio(portfolio._id, voteType);
    if (result.success) {
      setPortfolio((prev) => ({
        ...prev,
        upvotes: result.data.upvotes,
        downvotes: result.data.downvotes,
      }));
    } else {
      setVoteError(result.error || "Failed to vote");
    }
    setVoteLoading(false);
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

  const handleCommentSubmit = async () => {
    await fetchComments();
    // Update comment count in portfolio state
    setPortfolio((prev) =>
      prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev
    );
  };

  if (loading) {
    return <div className="loading">Loading portfolio details...</div>;
  }
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  if (!portfolio) {
    return <div className="alert alert-danger">Portfolio not found</div>;
  }

  return (
    <div className="stock-details">
      <div style={{ marginBottom: 16 }}>
        <Link to="/rate-my-portfolio" className="back-link">
          ← Back to Portfolios
        </Link>
      </div>
      <div className="stock-header">
        <div className="stock-image-container">
          {portfolio.imageUrl && (
            <img
              src={portfolio.imageUrl}
              alt={portfolio.title}
              className="stock-logo"
            />
          )}
          {portfolio.isPremium && <div className="premium-badge">PRO</div>}
        </div>
        <div className="stock-title">
          <h1>{portfolio.title}</h1>
          <div className="stock-meta">
            <span className="author-name">
              {portfolio.author?.username || "Anonymous"}
            </span>
            <span className="post-date">
              {new Date(portfolio.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span
              className="category-tag"
              style={{ backgroundColor: getCategoryColor(portfolio.category) }}
            >
              {portfolio.category}
            </span>
          </div>
          <div
            className={`performance-overlay ${getPerformanceClass(
              portfolio.performance
            )}`}
            style={{ marginTop: 8 }}
          >
            <span className="performance-text">{portfolio.performance}</span>
          </div>
        </div>
      </div>
      <div className="stock-description">
        <h3>Description</h3>
        <p>{portfolio.description || <em>No description provided.</em>}</p>
      </div>
      <div className="portfolio-stats">
        <div className="vote-section">
          <button
            className="vote-btn upvote"
            onClick={() => handleVote("upvote")}
            disabled={voteLoading}
            title="Upvote"
          >
            ▲
          </button>
          <span className="vote-count">
            {portfolio.upvotes - portfolio.downvotes}
          </span>
          <button
            className="vote-btn downvote"
            onClick={() => handleVote("downvote")}
            disabled={voteLoading}
            title="Downvote"
          >
            ▼
          </button>
          {voteError && <span className="vote-error">{voteError}</span>}
        </div>
        <div className="comments-info">
          <span className="comments-icon">💬</span>
          <span className="comments-count">{portfolio.commentCount}</span>
          <span className="comments-label">
            {portfolio.commentCount === 1 ? "comment" : "comments"}
          </span>
        </div>
      </div>
      <div className="comments-section">
        <h3>Comments ({portfolio.commentCount})</h3>
        <PortfolioCommentForm
          portfolioId={portfolio._id}
          onSubmit={handleCommentSubmit}
        />
        {commentsLoading ? (
          <div className="alert alert-info">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="alert alert-info">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <PortfolioComment
              key={comment._id}
              comment={comment}
              portfolioId={portfolio._id}
              onUpdate={fetchComments}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PortfolioDetail;
