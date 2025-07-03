import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { createComment } from "../services/commentService";

const ReplyForm = ({
  onSubmit,
  parentCommentId,
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
      setError("Reply cannot be empty");
      return;
    }

    if (!stockId || !parentCommentId) {
      setError("Missing required information");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await createComment({
        content: content.trim(),
        isAnonymous: !isAuthenticated() || isAnonymous,
        parentCommentId,
        stockId,
      });

      if (result.success) {
        setContent("");
        setIsAnonymous(false);
        if (onSubmit) onSubmit();
      } else {
        setError(result.error || "Failed to submit reply");
      }
    } catch (error: unknown) {
      console.error("Error submitting reply:", error);
      setError("Failed to submit reply");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    setError("");
    if (onSubmit) onSubmit();
  };

  return (
    <div className="reply-form">
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            autoFocus
            className="form-control"
            disabled={loading}
            maxLength={500}
            onChange={(e: any) => setContent(e.target.value)}
            placeholder={
              isAuthenticated()
                ? "Write your reply..."
                : "Write your reply (posting anonymously)..."
            }
            rows="3"
            value={content}
          />
          <small className="form-text text-muted">
            {content.length}/500 characters
          </small>
        </div>

        {isAuthenticated() && (
          <div className="form-group form-check">
            <input
              checked={isAnonymous}
              className="form-check-input"
              disabled={loading}
              id={`anonymousReply-${parentCommentId}`}
              onChange={(e: any) => setIsAnonymous(e.target.checked)}
              type="checkbox"
            />
            <label
              className="form-check-label"
              htmlFor={`anonymousReply-${parentCommentId}`}
            >
              Reply anonymously
            </label>
          </div>
        )}

        {!isAuthenticated() && (
          <div className="alert alert-info">
            <small>
              💡 Replying as a guest. <a href="/login">Sign in</a> for the full
              experience!
            </small>
          </div>
        )}

        <div className="form-group reply-actions">
          <button
            className="btn btn-primary btn-sm"
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
                💬 Post Reply
                {(!isAuthenticated() || isAnonymous) && " (Anonymous)"}
              </>
            )}
          </button>

          <button
            className="btn btn-secondary btn-sm ml-2"
            disabled={loading}
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;
