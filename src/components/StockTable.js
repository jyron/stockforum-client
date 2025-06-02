import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { likeStock, dislikeStock } from "../services/stockService";

const StockTable = ({ stocks, onUpdate }) => {
  const { user, isAuthenticated } = useAuth();

  // Helper function to format the last activity
  const getLastActivity = (stock) => {
    if (stock.lastComment) {
      const date = new Date(stock.lastComment.date);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    }
    return "no comments";
  };

  // Helper function to check if user has liked/disliked a stock
  const hasUserLiked = (stock) => {
    if (!stock.likedBy && !stock.likedByAnonymous) return false;

    // For authenticated users, check the likedBy array
    if (user && stock.likedBy) {
      return stock.likedBy.some(
        (id) =>
          id === user.id ||
          id === user._id ||
          id.toString() === user.id ||
          id.toString() === user._id
      );
    }

    // For anonymous users, we can't reliably check client-side
    // The server will handle duplicate prevention
    return false;
  };

  const hasUserDisliked = (stock) => {
    if (!stock.dislikedBy && !stock.dislikedByAnonymous) return false;

    // For authenticated users, check the dislikedBy array
    if (user && stock.dislikedBy) {
      return stock.dislikedBy.some(
        (id) =>
          id === user.id ||
          id === user._id ||
          id.toString() === user.id ||
          id.toString() === user._id
      );
    }

    // For anonymous users, we can't reliably check client-side
    // The server will handle duplicate prevention
    return false;
  };

  // Handle like/dislike actions
  const handleLike = async (stock) => {
    try {
      const result = await likeStock(stock._id);
      if (result.success && onUpdate) {
        onUpdate(); // Refresh the stocks list
      } else {
        console.error("Error liking stock:", result.error);
        if (result.error && !result.error.includes("already liked")) {
          alert(result.error);
        }
      }
    } catch (error) {
      console.error("Error liking stock:", error);
    }
  };

  const handleDislike = async (stock) => {
    try {
      const result = await dislikeStock(stock._id);
      if (result.success && onUpdate) {
        onUpdate(); // Refresh the stocks list
      } else {
        console.error("Error disliking stock:", result.error);
        if (result.error && !result.error.includes("already disliked")) {
          alert(result.error);
        }
      }
    } catch (error) {
      console.error("Error disliking stock:", error);
    }
  };

  return (
    <div className="stock-table-container">
      <div className="table-header">
        <div className="col-symbol">Symbol</div>
        <div className="col-name">Name</div>
        <div className="col-price">Price</div>
        <div className="col-change">Change</div>
        <div className="col-stats">Stats</div>
        <div className="conversation-info">Discussion</div>
      </div>

      {stocks.map((stock) => (
        <div key={stock._id} className="table-row">
          <div className="col-symbol">
            <Link to={`/stocks/${stock.symbol}`}>{stock.symbol}</Link>
          </div>

          <div className="col-name">{stock.name}</div>

          <div className="col-price">
            ${stock.currentPrice?.toFixed(2) || "N/A"}
          </div>

          <div className="col-change">
            <span
              className={`percent-change ${
                stock.percentChange > 0
                  ? "positive"
                  : stock.percentChange < 0
                  ? "negative"
                  : ""
              }`}
            >
              {stock.percentChange !== undefined && stock.percentChange !== null
                ? `${stock.percentChange > 0 ? "+" : ""}${parseFloat(
                    stock.percentChange
                  ).toFixed(2)}%`
                : "N/A"}
            </span>
          </div>

          <div className="col-stats">
            <div className="stats-container">
              <div className="vote-buttons">
                <button
                  className={`vote-btn ${
                    hasUserLiked(stock) ? "active liked" : ""
                  }`}
                  onClick={() => handleLike(stock)}
                  title="Like this stock"
                >
                  👍 {stock.likes || 0}
                </button>
                <button
                  className={`vote-btn ${
                    hasUserDisliked(stock) ? "active disliked" : ""
                  }`}
                  onClick={() => handleDislike(stock)}
                  title="Dislike this stock"
                >
                  👎 {stock.dislikes || 0}
                </button>
              </div>
            </div>
          </div>
          <div className="conversation-info">
            {stock.commentCount > 0 ? (
              <>
                <Link to={`/stocks/${stock.symbol}`}>
                  {stock.commentCount}{" "}
                  {stock.commentCount === 1 ? "comment" : "comments"}
                </Link>
                {" - "}
                <span style={{ color: "#666" }}>{getLastActivity(stock)}</span>
                {stock.lastComment && (
                  <>
                    {" - "}
                    <span style={{ color: "#666", fontSize: "0.9em" }}>
                      {stock.lastComment.author}: {stock.lastComment.content}
                    </span>
                  </>
                )}
              </>
            ) : (
              <Link to={`/stocks/${stock.symbol}`}>start discussion</Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StockTable;
