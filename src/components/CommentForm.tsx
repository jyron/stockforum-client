import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { createComment } from "../services/commentService";
import "./Comment.css";

const CommentForm = ({
  onSubmit,
  stockId
}: any) => {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    if (!stockId) {
      setError("Stock ID is missing");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await createComment({
        content: content.trim(),
        isAnonymous: !isAuthenticated() || isAnonymous,
        stockId,
      });

      if (result.success) {
        setContent("");
        setIsAnonymous(false);
        if (onSubmit) onSubmit();
      } else {
        setError(result.error || "Failed to submit comment");
      }
    } catch (error: unknown) {
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
            disabled={loading}
            maxLength={1000}
            onChange={(e: any) => setContent(e.target.value)}
            placeholder={
              isAuthenticated()
                ? "Share your thoughts about this stock..."
                : "Share your thoughts about this stock (posting anonymously)..."
            }
            rows="4"
            value={content}
          />
          <small className="form-text text-muted">
            {content.length}/1000 characters
          </small>
        </div>

        {isAuthenticated() && (
          <div className="form-group form-check">
            <input
              checked={isAnonymous}
              className="form-check-input"
              disabled={loading}
              id="anonymousCheck"
              onChange={(e: any) => setIsAnonymous(e.target.checked)}
              type="checkbox"
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
            className="btn btn-primary"
            disabled={loading || !content.trim()}
            type="submit"
          >
            {loading ? (
              <>
                <span
                  aria-hidden="true"
                  className="spinner-border spinner-border-sm"
                  role="status"
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

export default CommentForm;
