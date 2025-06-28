import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import // Portfolio comment voting and deletion functions to be implemented in a later task
"../services/portfolioService";
import ReplyForm from "./ReplyForm";
import "./Comment.css";

const PortfolioComment = ({
  comment = {},
  portfolioId,
  onUpdate,
  isReply = false,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);

  // Check if current user is the author
  const isAuthor =
    user &&
    comment.author &&
    (comment.author._id === user.id ||
      comment.author.id === user.id ||
      comment.author._id === user._id ||
      comment.author.id === user._id);

  // Check if user has liked/disliked (for authenticated users)
  const isLiked =
    user &&
    comment.likedBy?.some(
      (id) =>
        id === user.id ||
        id === user._id ||
        id.toString() === user.id ||
        id.toString() === user._id
    );
  const isDisliked =
    user &&
    comment.dislikedBy?.some(
      (id) =>
        id === user.id ||
        id === user._id ||
        id.toString() === user.id ||
        id.toString() === user._id
    );

  if (!comment._id) {
    return null; // Return null if we don't have a valid comment
  }

  // TODO: Implement portfolio comment voting and deletion using portfolioService
  const handleLike = async () => {
    // Placeholder for like functionality
    if (onUpdate) onUpdate();
  };

  const handleDislike = async () => {
    // Placeholder for dislike functionality
    if (onUpdate) onUpdate();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      // Placeholder for delete functionality
      if (onUpdate) onUpdate();
    }
  };

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getAuthorName = () => {
    if (comment.isAnonymous) {
      return "Anonymous";
    }
    if (comment.author && comment.author.username) {
      return comment.author.username;
    }
    return "Anonymous";
  };

  return (
    <div className={`comment ${isReply ? "comment-reply" : ""}`}>
      <div className="comment-header">
        <div className="comment-author">
          {getAuthorName()}
          {comment.isAnonymous && <span className="anonymous-badge">👤</span>}
        </div>
        <div className="comment-date">{formatDate(comment.createdAt)}</div>
      </div>

      <div className="comment-content">{comment.content}</div>

      <div className="comment-footer">
        <div className="comment-actions">
          <button
            className="btn btn-secondary"
            onClick={toggleReplyForm}
            title="Reply to this comment"
          >
            💬 Reply
          </button>

          {isAuthor && isAuthenticated() && (
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              title="Delete this comment"
            >
              🗑️ Delete
            </button>
          )}
        </div>

        <div className="comment-stats">
          <button
            className={`vote-btn ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
            title="Like this comment"
          >
            👍 {comment.likes || 0}
          </button>
          <button
            className={`vote-btn ${isDisliked ? "disliked" : ""}`}
            onClick={handleDislike}
            title="Dislike this comment"
          >
            👎 {comment.dislikes || 0}
          </button>
        </div>
      </div>

      {showReplyForm && (
        <div className="reply-form-container">
          <ReplyForm
            portfolioId={portfolioId}
            parentCommentId={comment._id}
            onSubmit={() => {
              setShowReplyForm(false);
              if (onUpdate) onUpdate();
            }}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          <div className="replies-header">
            <span className="replies-count">
              {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}
            </span>
          </div>
          {comment.replies.map((reply) => (
            <PortfolioComment
              key={reply._id}
              comment={reply}
              portfolioId={portfolioId}
              onUpdate={onUpdate}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioComment;
