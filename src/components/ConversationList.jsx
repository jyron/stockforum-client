import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  likeConversation,
  unlikeConversation,
} from "../services/conversationService";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import "../styles/components.css";
import "../styles/typography.css";

const ConversationList = ({ conversations = [] }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState("");
  const { isAuthenticated } = useAuth();

  const handleLike = async (e, conversationId, isLiked) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      setAuthAction("like this conversation");
      setShowAuthModal(true);
      return;
    }

    try {
      if (isLiked) {
        await unlikeConversation(conversationId);
      } else {
        await likeConversation(conversationId);
      }
      // Refresh the conversations list
      window.location.reload();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  if (!Array.isArray(conversations)) {
    return (
      <div className="conversations-error">
        <div className="error-icon">⚠️</div>
        <h3 className="text-lg font-semibold text-primary mb-2">
          Unable to load conversations
        </h3>
        <p className="text-secondary">
          There was an error loading the conversations. Please try refreshing
          the page.
        </p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="conversations-empty">
        <div className="empty-icon">💬</div>
        <h3 className="text-xl font-semibold text-primary mb-3">
          No conversations yet
        </h3>
        <p className="text-secondary mb-6">
          Be the first to start a meaningful discussion in the community.
        </p>
        {isAuthenticated() && (
          <Link to="/new-conversation" className="start-conversation-btn">
            Start First Conversation
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="conversations-container">
        <div className="conversations-grid">
          {conversations.map((conversation) => (
            <article key={conversation._id} className="conversation-item">
              <div className="conversation-main">
                <div className="conversation-header-row">
                  <Link
                    to={`/conversation/${conversation._id}`}
                    className="conversation-title-link"
                  >
                    <h2 className="conversation-title">{conversation.title}</h2>
                  </Link>
                  <div className="conversation-actions">
                    <button
                      className={`like-btn ${
                        conversation.isLiked ? "liked" : ""
                      }`}
                      onClick={(e) =>
                        handleLike(e, conversation._id, conversation.isLiked)
                      }
                      title={conversation.isLiked ? "Unlike" : "Like"}
                    >
                      <span className="like-icon">
                        {conversation.isLiked ? "❤️" : "🤍"}
                      </span>
                      <span className="like-count">
                        {conversation.likes || 0}
                      </span>
                    </button>
                  </div>
                </div>

                <p className="conversation-excerpt">
                  {conversation.content.length > 280
                    ? `${conversation.content.substring(0, 280)}...`
                    : conversation.content}
                </p>

                <div className="conversation-footer">
                  <div className="conversation-author-info">
                    <div className="author-avatar">
                      {conversation.author?.username?.charAt(0).toUpperCase() ||
                        "A"}
                    </div>
                    <div className="author-details">
                      <span className="author-name">
                        {conversation.author?.username || "Anonymous"}
                      </span>
                      <span className="conversation-timestamp">
                        {formatDate(conversation.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="conversation-stats">
                    <div className="stat-item">
                      <span className="stat-icon">💬</span>
                      <span className="stat-value">
                        {conversation.commentCount || 0}
                      </span>
                      <span className="stat-label">
                        {conversation.commentCount === 1 ? "reply" : "replies"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action={authAction}
      />
    </>
  );
};

export default ConversationList;
