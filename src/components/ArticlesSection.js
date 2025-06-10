import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/components.css";

const ArticlesSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/api/articles/all");
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
    };

    fetchArticles();
  }, []);

  if (loading) return <div className="loading">Loading articles...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (articles.length === 0) return null;

  return (
    <section className="articles-section">
      <div className="articles-header">
        <h2>Latest Market Insights</h2>
      </div>

      <div className="articles-list-vertical">
        {articles.map((article) => (
          <Link
            to={`/article/${article._id}`}
            key={article._id}
            className="article-vertical-card"
          >
            <div className="article-category">{article.category}</div>
            <h3 className="article-title">{article.title}</h3>
            <p className="article-excerpt">{article.excerpt}</p>
            <div className="article-meta">
              <span className="article-date">
                {new Date(article.createdAt).toLocaleDateString()}
              </span>
              <span className="article-read-time">
                {article.readTime} min read
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="articles-footer">
        <Link to="/articles" className="view-all-link">
          View All Articles
        </Link>
      </div>
    </section>
  );
};

export default ArticlesSection;
