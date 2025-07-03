import "../styles/components.css";

const SocialShare = ({
  description,
  title,
  url
}: any) => {
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
  };

  const handleShare = (platform: any) => {
    const shareUrl = shareUrls[platform];
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="social-share">
      <span className="share-label">Share:</span>
      <div className="share-buttons">
        <button
          aria-label="Share on Twitter"
          className="share-button twitter"
          onClick={() => handleShare("twitter")}
        >
          <i className="fab fa-twitter"></i>
        </button>
        <button
          aria-label="Share on Facebook"
          className="share-button facebook"
          onClick={() => handleShare("facebook")}
        >
          <i className="fab fa-facebook"></i>
        </button>
        <button
          aria-label="Share on LinkedIn"
          className="share-button linkedin"
          onClick={() => handleShare("linkedin")}
        >
          <i className="fab fa-linkedin"></i>
        </button>
        <button
          aria-label="Share on Reddit"
          className="share-button reddit"
          onClick={() => handleShare("reddit")}
        >
          <i className="fab fa-reddit"></i>
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
