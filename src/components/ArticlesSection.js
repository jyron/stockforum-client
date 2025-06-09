import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/components.css";

const ArticlesSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/articles/published`
        );
        setArticles(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load articles");
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="articles-section">
        <div className="articles-header">
          <h2>StockForum.io Articles</h2>
        </div>
        <div className="loading">Loading articles...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="articles-section">
        <div className="articles-header">
          <h2>StockForum.io Articles</h2>
        </div>
        <div className="error-message">{error}</div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="articles-section">
        <div className="articles-header">
          <h2>StockForum.io Articles</h2>
        </div>
        <div className="empty-state">No articles available yet.</div>
      </section>
    );
  }

  return (
    <section className="articles-section">
      <div className="articles-header">
        <h2>StockForum.io Articles</h2>
        <p className="articles-subtitle">
          Daily insights and analysis from our expert contributors
        </p>
      </div>

      <div className="articles-grid">
        {articles.map((article) => (
          <article key={article._id} className="article-card">
            <span className="article-category">{article.category}</span>
            <h3 className="article-title">{article.title}</h3>
            <p className="article-excerpt">{article.excerpt}</p>
            <div className="article-meta">
              <span className="article-author">
                👤 {article.author.username}
              </span>
              <span className="article-date">
                {new Date(article.publishedAt).toLocaleDateString()}
              </span>
              <span className="article-read-time">
                ⏱️ {article.readTime} min read
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="articles-footer">
        <Link to="/articles" className="view-all-link">
          View All Articles →
        </Link>
      </div>
    </section>
  );
};

export default ArticlesSection;
