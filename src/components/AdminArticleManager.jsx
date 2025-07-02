import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/components.css";

const AdminArticleManager = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "Market Analysis",
    readTime: 5,
    isPublished: false,
  });

  const fetchArticles = useCallback(async () => {
    try {
      if (!isAuthenticated()) {
        setError("Not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      const response = await api.get("/api/articles/admin/all");
      setArticles(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load articles. Please check your connection and try again."
      );
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAuthenticated()) {
        setError("Not authenticated. Please log in.");
        return;
      }

      if (editingArticle) {
        await api.put(`/api/articles/${editingArticle._id}`, formData);
      } else {
        await api.post("/api/articles", formData);
      }
      fetchArticles();
      resetForm();
    } catch (err) {
      console.error("Error saving article:", err);
      setError(
        err.response?.data?.message ||
          "Failed to save article. Please try again."
      );
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category,
      readTime: article.readTime,
      isPublished: article.isPublished,
    });
  };

  const handleDelete = async (articleId) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        if (!isAuthenticated()) {
          setError("Not authenticated. Please log in.");
          return;
        }

        await api.delete(`/api/articles/${articleId}`);
        fetchArticles();
      } catch (err) {
        console.error("Error deleting article:", err);
        setError(
          err.response?.data?.message ||
            "Failed to delete article. Please try again."
        );
      }
    }
  };

  const resetForm = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "Market Analysis",
      readTime: 5,
      isPublished: false,
    });
  };

  if (loading) return <div className="loading">Loading articles...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-article-manager">
      <h2>{editingArticle ? "Edit Article" : "Create New Article"}</h2>
      <form onSubmit={handleSubmit} className="article-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter article title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            required
            maxLength={300}
            placeholder="Enter a brief excerpt (max 300 characters)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={10}
            placeholder="Enter article content"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="Market Analysis">Market Analysis</option>
            <option value="Stock Picks">Stock Picks</option>
            <option value="Trading Tips">Trading Tips</option>
            <option value="News">News</option>
            <option value="Education">Education</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="readTime">Read Time (minutes)</label>
          <input
            type="number"
            id="readTime"
            name="readTime"
            value={formData.readTime}
            onChange={handleInputChange}
            required
            min={1}
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleInputChange}
            />
            Publish immediately
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingArticle ? "Update Article" : "Create Article"}
          </button>
          {editingArticle && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="articles-list">
        <h3>Manage Articles</h3>
        {articles.length === 0 ? (
          <div className="empty-state">
            No articles yet. Create your first article above!
          </div>
        ) : (
          articles.map((article) => (
            <div key={article._id} className="article-item">
              <div className="article-info">
                <h4>{article.title}</h4>
                <span
                  className={`status ${
                    article.isPublished ? "published" : "draft"
                  }`}
                >
                  {article.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <div className="article-actions">
                <button
                  onClick={() => handleEdit(article)}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(article._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminArticleManager;
