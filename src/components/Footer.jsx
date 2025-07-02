import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>StockForum.io &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
