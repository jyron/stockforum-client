import React, { useState } from "react";
import { createPortfolioComment } from "../services/portfolioService";
import { useAuth } from "../context/AuthContext";
import "./Comment.css";

const PortfolioCommentForm = ({ portfolioId, onSubmit, parentCommentId }) => {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    if (!portfolioId) {
      setError("Portfolio ID is missing");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        content: content.trim(),
        portfolioId,
        isAnonymous: !isAuthenticated() || isAnonymous,
      };
      if (parentCommentId) {
        payload.parentCommentId = parentCommentId;
      }
      const result = await createPortfolioComment(payload);

      if (result.success) {
        setContent("");
        setIsAnonymous(false);
        if (onSubmit) onSubmit();
      } else {
        setError(result.error || "Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Failed to submit comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-form">
      <h3>Leave a Comment</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            className="form-control"
            rows="4"
            placeholder={
              isAuthenticated()
                ? "Share your thoughts about this portfolio..."
                : "Share your thoughts about this portfolio (posting anonymously)..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            maxLength={1000}
          />
          <small className="form-text text-muted">
            {content.length}/1000 characters
          </small>
        </div>

        {isAuthenticated() && (
          <div className="form-group form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="anonymousCheck"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              disabled={loading}
            />
            <label className="form-check-label" htmlFor="anonymousCheck">
              Post anonymously
            </label>
          </div>
        )}

        {!isAuthenticated() && (
          <div className="alert alert-info">
            <small>
              💡 You're posting as a guest. <a href="/login">Sign in</a> to get
              the full experience!
            </small>
          </div>
        )}

        <div className="form-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !content.trim()}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>{" "}
                Posting...
              </>
            ) : (
              <>
                💬 Post Comment
                {(!isAuthenticated() || isAnonymous) && " (Anonymous)"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PortfolioCommentForm;
