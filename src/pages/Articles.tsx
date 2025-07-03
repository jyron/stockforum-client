import { Link } from "react-router-dom";

import api from "../services/api";
import "../styles/components.css";

const Articles = () => {
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

  return (
    <div className="articles-page">
      <header className="page-header">
        <h1>StockForum.io Articles</h1>
        <p>Expert insights and analysis for informed trading decisions</p>
      </header>

      <div className="articles-grid">
        {articles.length === 0 ? (
          <div className="empty-state">No articles available yet.</div>
        ) : (
          articles.map((article) => (
            <Link
              className="article-card"
              key={article._id}
              to={`/article/${article._id}`}
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
          ))
        )}
      </div>
    </div>
  );
};

export default Articles;
