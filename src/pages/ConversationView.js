import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getConversation,
  getConversationComments,
  addComment,
} from "../services/conversationService";
import "../styles/components.css";

const ConversationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    fetchConversationAndComments();
  }, [id]);

  const fetchConversationAndComments = async () => {
    try {
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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const result = await addComment(id, {
        content: newComment,
        isAnonymous,
        parentComment: replyTo,
      });

      if (result.success) {
        setComments((prev) => [...prev, result.data]);
        setNewComment("");
        setIsAnonymous(false);
        setReplyTo(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    navigate(-1); // This will go back to the previous page
  };

  const renderComments = (parentId = null, depth = 0) => {
    const filteredComments = comments.filter((comment) =>
      parentId ? comment.parentComment === parentId : !comment.parentComment
    );

    return filteredComments.map((comment) => (
      <div
        key={comment._id}
        className="comment"
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <div className="comment-header">
          <span className="comment-author">
            {comment.isAnonymous ? "Anonymous" : comment.author?.username}
          </span>
          <span className="comment-date">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="comment-content">{comment.content}</p>
        <div className="comment-actions">
          <button
            onClick={() => setReplyTo(comment._id)}
            className="reply-button"
          >
            Reply
          </button>
        </div>
        {renderComments(comment._id, depth + 1)}
      </div>
    ));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!conversation) return <div>Conversation not found</div>;

  return (
    <div className="conversation-view">
      <button onClick={handleBack} className="back-button">
        ← Back
      </button>
      <div className="conversation-header">
        <h1>{conversation.title}</h1>
        <div className="conversation-meta">
          <span className="conversation-author">
            {conversation.isAnonymous
              ? "Anonymous"
              : conversation.author?.username}
          </span>
          <span className="conversation-date">
            {new Date(conversation.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="conversation-content">
        <p>{conversation.content}</p>
      </div>

      <div className="comments-section">
        <h2>Comments</h2>
        {renderComments()}

        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
            required
          />
          <div className="form-actions">
            <label className="anonymous-checkbox">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.checked)}
              />
              Post anonymously
            </label>
            {replyTo && (
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="cancel-reply"
              >
                Cancel Reply
              </button>
            )}
            <button type="submit" className="submit-comment">
              {replyTo ? "Post Reply" : "Post Comment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConversationView;
