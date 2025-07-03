import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "../styles/components.css";
import { createConversation } from "../services/conversationService";

const NewConversation = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: "/new-conversation" } });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await createConversation({
      content,
      isAnonymous,
      title,
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
      <form className="conversation-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            maxLength={200}
            minLength={3}
            onChange={(e: any) => setTitle(e.target.value)}
            placeholder="Enter a title for your conversation"
            required
            type="text"
            value={title}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            minLength={10}
            onChange={(e: any) => setContent(e.target.value)}
            placeholder="What would you like to discuss?"
            required
            rows={10}
            value={content}
          />
        </div>
        <div className="form-group checkbox">
          <label>
            <input
              checked={isAnonymous}
              onChange={(e: any) => setIsAnonymous(e.target.checked)}
              type="checkbox"
            />
            Post anonymously
          </label>
        </div>
        <div className="form-actions">
          <button
            className="cancel-button"
            onClick={() => navigate("/")}
            type="button"
          >
            Cancel
          </button>
          <button
            className="submit-button"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating..." : "Create Conversation"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewConversation;
