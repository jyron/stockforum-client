import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getConversation,
  getConversationComments,
  addComment,
} from "../services/conversationService";
import AuthModal from "../components/AuthModal";
import SocialShare from "../components/SocialShare";
import "../styles/components.css";
import "../styles/typography.css";

const ConversationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState("");

  const fetchConversationAndComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const [conversationResult, commentsResult] = await Promise.all([
        getConversation(id),
        getConversationComments(id),
      ]);

      if (!conversationResult.success || !commentsResult.success) {
        throw new Error(
          conversationResult.error ||
            commentsResult.error ||
            "Failed to fetch data"
        );
      }

      setConversation(conversationResult.data);
      setComments(commentsResult.data);
      setError(null);
    } catch (err) {
      setError("Failed to load conversation");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchConversationAndComments();
  }, [fetchConversationAndComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      setAuthAction("add a comment");
      setShowAuthModal(true);
      return;
    }

    try {
      const result = await addComment(id, {
        content: newComment,
        parentComment: replyTo,
      });

      if (result.success) {
        setComments((prev) => [...prev, result.data]);
        setNewComment("");
        setReplyTo(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else if (diffInMinutes < 10080) {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const getReplyingToComment = () => {
    return comments.find((comment) => comment._id === replyTo);
  };

  const renderComments = (parentId = null, depth = 0) => {
    const filteredComments = comments.filter((comment) =>
      parentId ? comment.parentComment === parentId : !comment.parentComment
    );

    return filteredComments.map((comment) => (
      <div
        key={comment._id}
        className={`comment-thread ${depth > 0 ? "comment-reply" : ""}`}
        style={{
          marginLeft: depth > 0 ? `${Math.min(depth * 24, 96)}px` : "0",
          borderLeft: depth > 0 ? "2px solid var(--color-border)" : "none",
          paddingLeft: depth > 0 ? "16px" : "0",
        }}
      >
        <article className="comment-card">
          <div className="comment-header">
            <div className="comment-author-info">
              <div className="comment-author-avatar">
                {comment.author?.username?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="comment-author-details">
                <span className="comment-author-name">
                  {comment.author?.username || "Anonymous"}
                </span>
                <time className="comment-timestamp">
                  {formatDate(comment.createdAt)}
                </time>
              </div>
            </div>
            <div className="comment-actions">
              <button
                onClick={() => {
                  if (!isAuthenticated()) {
                    setAuthAction("reply to this comment");
                    setShowAuthModal(true);
                    return;
                  }
                  setReplyTo(comment._id);
                  document.getElementById("comment-form")?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
                className="reply-btn"
                title="Reply to this comment"
              >
                <span className="reply-icon">↩️</span>
                Reply
              </button>
            </div>
          </div>
          <div className="comment-content">
            <p>{comment.content}</p>
          </div>
        </article>
        {renderComments(comment._id, depth + 1)}
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="conversation-loading">
        <div className="loading-spinner"></div>
        <p className="text-secondary">Loading conversation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conversation-error">
        <div className="error-icon">⚠️</div>
        <h2 className="text-xl font-semibold text-primary mb-2">
          Unable to load conversation
        </h2>
        <p className="text-secondary mb-4">{error}</p>
        <button onClick={handleBack} className="back-btn">
          ← Go Back
        </button>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="conversation-not-found">
        <div className="not-found-icon">🔍</div>
        <h2 className="text-xl font-semibold text-primary mb-2">
          Conversation not found
        </h2>
        <p className="text-secondary mb-4">
          This conversation may have been deleted or doesn't exist.
        </p>
        <button onClick={handleBack} className="back-btn">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="conversation-view-container">
      <div className="conversation-navigation">
        <button onClick={handleBack} className="back-btn">
          <span className="back-icon">←</span>
          Back to conversations
        </button>
      </div>

      <article className="conversation-article">
        <header className="conversation-article-header">
          <h1 className="conversation-article-title">{conversation.title}</h1>

          <div className="conversation-article-meta">
            <div className="author-info">
              <div className="author-avatar-large">
                {conversation.author?.username?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="author-details">
                <span className="author-name">
                  {conversation.author?.username || "Anonymous"}
                </span>
                <time className="published-time">
                  Published {formatDate(conversation.createdAt)}
                </time>
              </div>
            </div>

            <SocialShare
              url={window.location.href}
              title={conversation.title}
              description={conversation.content.substring(0, 200)}
            />
          </div>
        </header>

        <div className="conversation-article-content">
          <div className="content-text">
            {conversation.content.split("\n").map((paragraph, index) => (
              <p key={index} className="content-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>

      <section className="comments-section" id="comments">
        <div className="comments-header">
          <h2 className="comments-title">Discussion ({comments.length})</h2>
          <p className="comments-subtitle">
            Join the conversation and share your thoughts
          </p>
        </div>

        <div className="comments-list">
          {comments.length > 0 ? (
            renderComments()
          ) : (
            <div className="no-comments">
              <div className="no-comments-icon">💭</div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                No comments yet
              </h3>
              <p className="text-secondary">
                Be the first to share your thoughts on this conversation.
              </p>
            </div>
          )}
        </div>

        <div className="comment-form-container" id="comment-form">
          {replyTo && (
            <div className="reply-indicator">
              <div className="reply-info">
                <span className="reply-label">Replying to</span>
                <span className="reply-author">
                  {getReplyingToComment()?.author?.username || "Anonymous"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="cancel-reply-btn"
                title="Cancel reply"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="comment-form">
            <div className="form-header">
              <h3 className="form-title">
                {replyTo ? "Write a reply" : "Add your comment"}
              </h3>
            </div>

            <div className="form-body">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  replyTo
                    ? "Share your reply..."
                    : "Share your thoughts on this conversation..."
                }
                required
                className="comment-textarea"
                rows="4"
              />

              <div className="form-actions">
                <div className="form-actions-left">
                  {!isAuthenticated() && (
                    <p className="auth-note text-sm text-secondary">
                      You need to sign in to post a comment
                    </p>
                  )}
                </div>

                <div className="form-actions-right">
                  {replyTo && (
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="submit-btn">
                    {replyTo ? "Post Reply" : "Post Comment"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action={authAction}
      />
    </div>
  );
};

export default ConversationView;
