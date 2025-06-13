import React, { useState, useEffect } from "react";
import "../styles/components.css";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://financialmodelingprep.com/stable/news/stock-latest?page=0&limit=20&apikey=${process.env.REACT_APP_FMP_API_URL}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await response.json();
        setNews(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div className="news-section loading">Loading news...</div>;
  }

  if (error) {
    return <div className="news-section error">Error: {error}</div>;
  }

  return (
    <div className="news-section">
      <h3>Latest Market News</h3>
      <div className="news-list">
        {news.map((article) => (
          <div
            key={article.symbol + article.publishedDate}
            className="news-item"
          >
            <div className="news-content">
              <div className="news-image">
                <img src={article.image} alt={article.title} />
              </div>
              <div className="news-details">
                <div className="news-header">
                  <h4>{article.title}</h4>
                  <span className="news-date">
                    {new Date(article.publishedDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="news-text">{article.text}</p>
                <div className="news-footer">
                  <span className="news-source">
                    {article.publisher} ({article.site})
                  </span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-link"
                  >
                    Read more
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
