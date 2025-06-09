import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createConversation } from "../services/conversationService";
import "../styles/components.css";

const NewConversation = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await createConversation({
      title,
      content,
      isAnonymous,
    });

    if (result.success) {
      navigate(`/conversation/${result.data._id}`);
    } else {
      setError(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="new-conversation-container">
      <h2>Start a New Conversation</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="conversation-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your conversation"
            required
            minLength={3}
            maxLength={200}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What would you like to discuss?"
            required
            minLength={10}
            rows={10}
          />
        </div>
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            Post anonymously
          </label>
        </div>
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? "Creating..." : "Create Conversation"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewConversation;
