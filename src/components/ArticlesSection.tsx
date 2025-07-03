import { useEffect, useState } from "react";
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
    <section className="articles-sidebar">
      <div className="articles-header">
        <h3>Latest Market Insights</h3>
      </div>

      <div className="articles-sidebar-list">
        {articles.slice(0, 6).map((article) => (
          <Link
            className="article-sidebar-card"
            key={article._id}
            to={`/article/${article._id}`}
          >
            <div className="article-sidebar-category">{article.category}</div>
            <h4 className="article-sidebar-title">{article.title}</h4>
            <p className="article-sidebar-excerpt">
              {article.excerpt.length > 100
                ? `${article.excerpt.substring(0, 100)}...`
                : article.excerpt}
            </p>
            <div className="article-sidebar-meta">
              <span className="article-author">
                By {article.author?.username || "Anonymous"}
              </span>
              <span className="article-date">
                {new Date(article.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="articles-footer">
        <Link className="view-all-link" to="/articles">
          View All Articles →
        </Link>
      </div>
    </section>
  );
};

export default ArticlesSection;
