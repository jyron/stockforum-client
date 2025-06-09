import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  likeConversation,
  unlikeConversation,
} from "../services/conversationService";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import "../styles/components.css";

const ConversationList = ({ conversations = [] }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState("");

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

  if (!Array.isArray(conversations)) {
    return (
      <div className="error-message">
        Error loading conversations. Please try again later.
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="empty-state">
        <p>No conversations yet. Be the first to start one!</p>
      </div>
    );
  }

  return (
    <>
      <div className="conversation-list">
        {conversations.map((conversation) => (
          <div key={conversation._id} className="conversation-card">
            <div className="conversation-content">
              <Link
                to={`/conversation/${conversation._id}`}
                className="conversation-title-link"
              >
                <h3 className="conversation-title">{conversation.title}</h3>
              </Link>
              <p className="conversation-preview">
                {conversation.content.length > 200
                  ? `${conversation.content.substring(0, 200)}...`
                  : conversation.content}
              </p>
              <div className="conversation-meta">
                <span className="conversation-author">
                  {conversation.author?.username}
                </span>
                <span className="conversation-date">
                  {new Date(conversation.createdAt).toLocaleDateString()}
                </span>
                <div className="conversation-stats">
                  <button
                    className={`like-button ${
                      conversation.isLiked ? "liked" : ""
                    }`}
                    onClick={(e) =>
                      handleLike(e, conversation._id, conversation.isLiked)
                    }
                  >
                    👍 {conversation.likes || 0}
                  </button>
                  <span className="comments">
                    💬 {conversation.commentCount || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
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
