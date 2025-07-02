import React, { useState, useEffect } from "react";
import { getStockNews } from "../services/newsService";
import "./StockNews.css";

const StockNews = ({ symbol }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      if (!symbol) return;

      setLoading(true);
      setError("");

      try {
        const result = await getStockNews(symbol, 3); // Fetch 3 recent articles

        if (result.success) {
          setNews(result.data);
          if (result.cached) {
            console.log(`Using cached news for ${symbol}`);
          }
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to load news");
        console.error("Error in StockNews component:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbol]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return `${diffInMinutes}m ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
      }
    } catch {
      return "Recently";
    }
  };

  const handleImageError = (e) => {
    e.target.style.display = "none";
    e.target.nextSibling.style.display = "flex";
  };

  if (loading) {
    return (
      <div className="stock-news">
        <h2>Recent News</h2>
        <div className="news-loading">
          <div className="news-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-meta"></div>
            </div>
          </div>
          <div className="news-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-meta"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-news">
        <h2>Recent News</h2>
        <div className="news-error">
          <span className="error-icon">📰</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="stock-news">
        <h2>Recent News</h2>
        <div className="news-empty">
          <span className="empty-icon">📰</span>
          <p>No recent news available for {symbol}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-news">
      <h2>Recent News</h2>
      <div className="news-list">
        {news.map((article, index) => (
          <article key={index} className="news-article">
            <div className="news-image-container">
              {article.image && (
                <>
                  <img
                    src={article.image}
                    alt={article.title}
                    className="news-image"
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <div className="news-placeholder" style={{ display: "none" }}>
                    <span className="placeholder-icon">📄</span>
                  </div>
                </>
              )}
              {!article.image && (
                <div className="news-placeholder">
                  <span className="placeholder-icon">📄</span>
                </div>
              )}
            </div>

            <div className="news-content">
              <h3 className="news-title">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-link"
                >
                  {article.title}
                </a>
              </h3>

              {article.text && <p className="news-excerpt">{article.text}</p>}

              <div className="news-meta">
                <span className="news-publisher">
                  {article.publisher || article.site}
                </span>
                <span className="news-date">
                  {formatDate(article.publishedDate)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default StockNews;
