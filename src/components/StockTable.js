import React from "react";
import { Link } from "react-router-dom";

const StockTable = ({ stocks, onUpdate }) => {
  // Helper function to format the last activity
  const getLastActivity = (stock) => {
    if (stock.lastComment) {
      const date = new Date(stock.lastComment.date);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    }
    return "no comments";
  };

  return (
    <div className="stock-table-container">
      <div
        style={{
          padding: "5px 0",
          borderBottom: "1px solid #ccc",
          marginBottom: "5px",
        }}
      >
        <strong>Stocks</strong>
      </div>

      {/* Header Row */}
      <div className="table-row">
        <div className="col-symbol">Symbol</div>
        <div className="col-name">Name</div>
        <div className="col-price">Price</div>
        <div className="col-change">%Change</div>
        <div className="conversation-info">Comments</div>
      </div>

      {stocks.map((stock) => (
        <div key={stock._id} className="table-row">
          <div className="col-symbol">
            <Link to={`/stocks/${stock.symbol}`}>{stock.symbol}</Link>
          </div>

          <div className="col-name">{stock.name}</div>

          <div className="col-price">
            ${stock.currentPrice?.toFixed(2) || "N/A"}
          </div>

          <div className="col-change">
            <span
              className={`percent-change ${
                stock.percentChange > 0
                  ? "positive"
                  : stock.percentChange < 0
                  ? "negative"
                  : ""
              }`}
            >
              {stock.percentChange !== undefined && stock.percentChange !== null
                ? `${stock.percentChange > 0 ? "+" : ""}${parseFloat(
                    stock.percentChange
                  ).toFixed(2)}%`
                : "N/A"}
            </span>
          </div>

          <div className="conversation-info">
            {stock.commentCount > 0 ? (
              <>
                <Link to={`/stocks/${stock.symbol}`}>
                  {stock.commentCount}{" "}
                  {stock.commentCount === 1 ? "reply" : "comments"}
                </Link>
                {" - "}
                <span style={{ color: "#666" }}>{getLastActivity(stock)}</span>
                {stock.lastComment && (
                  <>
                    {" - "}
                    <span style={{ color: "#666", fontSize: "0.9em" }}>
                      {stock.lastComment.author}: {stock.lastComment.content}
                    </span>
                  </>
                )}
              </>
            ) : (
              <Link to={`/stocks/${stock.symbol}`}>start discussion</Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StockTable;
