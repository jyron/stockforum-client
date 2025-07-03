import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getStockComments } from "../services/commentService";

const StockCard = ({
  onUpdate,
  stock
}: any) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      if (stock && stock._id) {
        const result = await getStockComments(stock._id);
        if (result.success) {
          // Sort comments by date (newest first) and take first 2
          const sortedComments = result.data
            .sort((a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2);
          setComments(sortedComments);
        }
      }
    };

    fetchComments();
  }, [stock]);

  const isAuthor = user && stock.createdBy?._id === user.id;

  const getAuthorName = (comment: any) => {
    if (comment.isAnonymous) return "Anonymous";
    return comment.author?.username || "Unknown";
  };

  return (
    <div className="stock-card">
      <div className="stock-header">
        <h2>
          <span className="symbol">{stock.symbol}</span> - {stock.name}
        </h2>
        <div className="discussion-stats">
          <span className="comment-count">
            {stock.commentCount || 0} comments
          </span>
          {stock.likes > 0 && <span> • {stock.likes} likes</span>}
        </div>
      </div>

      <div className="stock-info">
        <p className="price">
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
          Change:{" "}
          {stock.percentChange !== undefined && stock.percentChange !== null
            ? `${stock.percentChange > 0 ? "+" : ""}${parseFloat(
                stock.percentChange
              ).toFixed(2)}%`
            : "N/A"}
        </p>
      </div>

      {comments.length > 0 && (
        <div className="recent-comments">
          <h3>Recent Comments</h3>
          {comments.map((comment) => (
            <div className="comment-preview" key={comment._id}>
              <div className="comment-author">{getAuthorName(comment)}</div>
              <div className="comment-content">💭 {comment.content}</div>
            </div>
          ))}
        </div>
      )}

      <div className="stock-actions">
        <Link className="btn btn-primary" to={`/stocks/${stock.symbol}`}>
          Join Discussion
        </Link>
        {isAuthor && (
          <button className="btn" onClick={onUpdate}>
            Delete
          </button>
        )}
      </div>

      <div className="stock-footer">
        <small>
          Posted by {stock.createdBy?.username || "Anonymous"} •{" "}
          {new Date(stock.createdAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  );
};

export default StockCard;
