import React from "react";
import "../styles/components.css";

const SocialShare = ({ url, title, description }) => {
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`,
  };

  const handleShare = (platform) => {
    const shareUrl = shareUrls[platform];
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="social-share">
      <span className="share-label">Share:</span>
      <div className="share-buttons">
        <button
          onClick={() => handleShare("twitter")}
          className="share-button twitter"
          aria-label="Share on Twitter"
        >
          <i className="fab fa-twitter"></i>
        </button>
        <button
          onClick={() => handleShare("facebook")}
          className="share-button facebook"
          aria-label="Share on Facebook"
        >
          <i className="fab fa-facebook"></i>
        </button>
        <button
          onClick={() => handleShare("linkedin")}
          className="share-button linkedin"
          aria-label="Share on LinkedIn"
        >
          <i className="fab fa-linkedin"></i>
        </button>
        <button
          onClick={() => handleShare("reddit")}
          className="share-button reddit"
          aria-label="Share on Reddit"
        >
          <i className="fab fa-reddit"></i>
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
