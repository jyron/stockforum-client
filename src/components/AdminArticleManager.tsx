import { useCallback, useEffect, useState } from "react";

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
    category: "Market Analysis",
    content: "",
    excerpt: "",
    isPublished: false,
    readTime: 5,
    title: "",
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

  const handleInputChange = (e: any) => {
    const { checked, name, type, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: any) => {
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

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setFormData({
      category: article.category,
      content: article.content,
      excerpt: article.excerpt,
      isPublished: article.isPublished,
      readTime: article.readTime,
      title: article.title,
    });
  };

  const handleDelete = async (articleId: any) => {
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
      category: "Market Analysis",
      content: "",
      excerpt: "",
      isPublished: false,
      readTime: 5,
      title: "",
    });
  };

  if (loading) return <div className="loading">Loading articles...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-article-manager">
      <h2>{editingArticle ? "Edit Article" : "Create New Article"}</h2>
      <form className="article-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            onChange={handleInputChange}
            placeholder="Enter article title"
            required
            type="text"
            value={formData.title}
          />
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            maxLength={300}
            name="excerpt"
            onChange={handleInputChange}
            placeholder="Enter a brief excerpt (max 300 characters)"
            required
            value={formData.excerpt}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            onChange={handleInputChange}
            placeholder="Enter article content"
            required
            rows={10}
            value={formData.content}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            onChange={handleInputChange}
            required
            value={formData.category}
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
            id="readTime"
            min={1}
            name="readTime"
            onChange={handleInputChange}
            required
            type="number"
            value={formData.readTime}
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              checked={formData.isPublished}
              name="isPublished"
              onChange={handleInputChange}
              type="checkbox"
            />
            Publish immediately
          </label>
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit">
            {editingArticle ? "Update Article" : "Create Article"}
          </button>
          {editingArticle && (
            <button className="btn-secondary" onClick={resetForm} type="button">
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
            <div className="article-item" key={article._id}>
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
                  className="btn-edit"
                  onClick={() => handleEdit(article)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(article._id)}
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
