import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  likeStock,
  dislikeStock,
  deleteStock,
  getStockBySymbol,
} from "../services/stockService";
import { getStockComments } from "../services/commentService";
import { useAuth } from "../context/AuthContext";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";

const StockDetail = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [stock, setStock] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStock = async () => {
    try {
      const result = await getStockBySymbol(symbol);
      if (result.success) {
        setStock(result.data);
      } else {
        setError("Stock not found");
      }
    } catch (error) {
      setError("Error fetching stock details");
      console.error(error);
    }
  };

  const fetchComments = async (stockId) => {
    if (!stockId) return;

    try {
      const result = await getStockComments(stockId);
      if (result.success) {
        const sortedComments = result.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComments(sortedComments);
      } else {
        console.error("Failed to fetch comments:", result.error);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchStock();
    if (stock?._id) {
      await fetchComments(stock._id);
    }
    setLoading(false);
  };

  // Load initial data when symbol changes
  useEffect(() => {
    const loadInitialData = async () => {
      await loadData();
    };
    loadInitialData();
  }, [symbol]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh comments when stock changes
  useEffect(() => {
    if (stock?._id) {
      fetchComments(stock._id);
    }
  }, [stock?._id]);

  const handleLike = async () => {
    // Only use the stock's ID for backend interactions
    if (!stock || !stock._id) {
      setError("Cannot like this stock right now");
      return;
    }

    const result = await likeStock(stock._id);

    if (result.success) {
      setStock((prevStock) => ({
        ...prevStock,
        likes: result.data.likes,
        dislikes: result.data.dislikes,
      }));
      // Refresh the full stock data to get updated like arrays
      await fetchStock();
    } else {
      setError(result.error || "Failed to like stock");
    }
  };

  const handleDislike = async () => {
    // Only use the stock's ID for backend interactions
    if (!stock || !stock._id) {
      setError("Cannot dislike this stock right now");
      return;
    }

    const result = await dislikeStock(stock._id);

    if (result.success) {
      setStock((prevStock) => ({
        ...prevStock,
        likes: result.data.likes,
        dislikes: result.data.dislikes,
      }));
      // Refresh the full stock data to get updated like arrays
      await fetchStock();
    } else {
      setError(result.error || "Failed to dislike stock");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      // Only use the stock's ID for backend interactions
      if (!stock || !stock._id) {
        setError("Cannot delete this stock right now");
        return;
      }

      const result = await deleteStock(stock._id);

      if (result.success) {
        navigate("/");
      } else {
        alert(result.error || "Failed to delete stock");
      }
    }
  };

  // Helper function to check if user has liked/disliked a stock
  const hasUserLiked = () => {
    if (!stock || (!stock.likedBy && !stock.likedByAnonymous)) return false;

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

  const hasUserDisliked = () => {
    if (!stock || (!stock.dislikedBy && !stock.dislikedByAnonymous))
      return false;

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

  const isLiked = hasUserLiked();
  const isDisliked = hasUserDisliked();
  const isAuthor = user && stock?.createdBy?._id === user.id;

  if (loading) {
    return <div className="loading">Loading stock details...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!stock) {
    return <div className="alert alert-danger">Stock not found</div>;
  }

  return (
    <div className="stock-details">
      <h1>
        {stock.symbol} - {stock.name}
      </h1>
      <p className="description">{stock.description}</p>

      <div className="price-info">
        <p className="current-price">
          Current Price: ${stock.currentPrice?.toFixed(2) || "N/A"}
        </p>
        <p
          className={`percent-change ${
            stock.percentChange > 0
              ? "positive"
              : stock.percentChange < 0
              ? "negative"
              : ""
          }`}
        >
          Percent Change:{" "}
          {stock.percentChange !== undefined && stock.percentChange !== null
            ? `${stock.percentChange > 0 ? "+" : ""}${parseFloat(
                stock.percentChange
              ).toFixed(2)}%`
            : "N/A"}
        </p>
      </div>

      <div className="stock-actions">
        <div className="stock-stats">
          <button
            className={`vote-btn ${isLiked ? "active" : ""}`}
            onClick={handleLike}
          >
            👍 {stock.likes || 0}
          </button>
          <button
            className={`vote-btn ${isDisliked ? "active" : ""}`}
            onClick={handleDislike}
          >
            👎 {stock.dislikes || 0}
          </button>
        </div>

        {isAuthor && (
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete Stock
          </button>
        )}
      </div>

      <div className="comments-section">
        <h2>Comments</h2>

        {stock && stock._id ? (
          <CommentForm
            stockId={stock._id}
            onSubmit={() => fetchComments(stock._id)}
          />
        ) : (
          <div className="alert alert-info">Loading comment form...</div>
        )}

        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              stockId={stock._id}
              onUpdate={() => fetchComments(stock._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default StockDetail;
