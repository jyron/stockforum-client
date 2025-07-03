import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";

import SocialShare from "../components/SocialShare";
import api from "../services/api";
import "../styles/components.css";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/api/articles/${id}`);
        setArticle(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load article. Please check your connection and try again."
        );
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <div className="loading">Loading article...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!article) return <div className="error-message">Article not found</div>;

  return (
    <div className="article-detail">
      <header className="article-header">
        <div className="article-meta">
          <span className="article-category">{article.category}</span>
          <span className="article-date">
            {new Date(article.createdAt).toLocaleDateString()}
          </span>
          <span className="article-read-time">{article.readTime} min read</span>
        </div>
        <h1 className="article-title">{article.title}</h1>
        <p className="article-excerpt">{article.excerpt}</p>
        <SocialShare
          description={article.excerpt}
          title={article.title}
          url={window.location.href}
        />
      </header>

      <div className="article-content markdown-content">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>

      <footer className="article-footer">
        <div className="article-author">
          <span className="author-label">Written by</span>
          <span className="author-name">
            {article.author?.username || "Anonymous"}
          </span>
        </div>
        <SocialShare
          description={article.excerpt}
          title={article.title}
          url={window.location.href}
        />
      </footer>
    </div>
  );
};

export default ArticleDetail;
