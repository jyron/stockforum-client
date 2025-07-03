import React from "react";

import "./LoadingBar.css";

const LoadingBar = () => (
  <div className="loading-bar-container">
    <div className="loading-bar">
      <div className="loading-bar-progress" />
    </div>
    <div className="loading-bar-text">Loading stocks...</div>
  </div>
);

export default LoadingBar;
