import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import PortfolioComment from "../components/PortfolioComment";
import PortfolioCommentForm from "../components/PortfolioCommentForm";
import { useAuth } from "../context/AuthContext";
import "./StockDetail.css";
import {
  getPortfolioById,
  getPortfolioComments,
  votePortfolio,
} from "../services/portfolioService";

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
            (a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt)
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

  const handleVote = async (voteType: any) => {
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
        downvotes: result.data.downvotes,
        upvotes: result.data.upvotes,
      }));
    } else {
      setVoteError(result.error || "Failed to vote");
    }
    setVoteLoading(false);
  };

  const getPerformanceClass = (performance: any) => {
    if (performance?.startsWith("+")) return "positive";
    if (performance?.startsWith("-")) return "negative";
    return "neutral";
  };

  const getCategoryColor = (category: any) => {
    const colors = {
      BOOMER: "#4a90e2",
      CRYPTO: "#f7931e",
      GAINS: "#00ff88",
      LOSSES: "#ff4444",
      OPTIONS: "#a259ff",
      OTHER: "#666",
      YOLO: "#ff6b35",
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
        <Link className="back-link" to="/rate-my-portfolio">
          ← Back to Portfolios
        </Link>
      </div>
      <div className="stock-header">
        <div className="stock-image-container">
          {portfolio.imageUrl && (
            <img
              alt={portfolio.title}
              className="stock-logo"
              src={portfolio.imageUrl}
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
                day: "numeric",
                month: "short",
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
            disabled={voteLoading}
            onClick={() => handleVote("upvote")}
            title="Upvote"
          >
            ▲
          </button>
          <span className="vote-count">
            {portfolio.upvotes - portfolio.downvotes}
          </span>
          <button
            className="vote-btn downvote"
            disabled={voteLoading}
            onClick={() => handleVote("downvote")}
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
          onSubmit={handleCommentSubmit}
          portfolioId={portfolio._id}
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
              comment={comment}
              key={comment._id}
              onUpdate={fetchComments}
              portfolioId={portfolio._id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PortfolioDetail;
