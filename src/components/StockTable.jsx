import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StockTable.css";

const StockTable = ({ stocks, onUpdate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 60; // Show 60 stocks per page

  // Reset to first page when stocks change (e.g., when filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [stocks]);

  // Calculate pagination
  const totalPages = Math.ceil(stocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStocks = stocks.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push("...");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        pages.push(1);
        if (totalPages > 5) {
          pages.push("...");
        }
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show current page with 2 on each side
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

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

  if (stocks.length === 0) {
    return (
      <div className="stock-table-container">
        <div className="empty-state">
          <p>No stocks found matching your criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-table-container">
      <div className="table-header-info">
        <div className="stock-table-title">
          <strong>Stocks</strong>
        </div>
        <div className="table-info">
          Showing {startIndex + 1}-{Math.min(endIndex, stocks.length)} of{" "}
          {stocks.length} stocks
        </div>
      </div>

      {/* Header Row */}
      <div className="table-row table-header">
        <div className="col-symbol">Symbol</div>
        <div className="col-name">Name</div>
        <div className="col-price">Price</div>
        <div className="col-change">%Change</div>
        <div className="conversation-info">Comments</div>
      </div>

      {currentStocks.map((stock) => (
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
                  {stock.commentCount === 1 ? "comment" : "comments"}
                </Link>
                <span className="last-activity-info">
                  {" - "}
                  {getLastActivity(stock)}
                </span>
                {stock.lastComment && (
                  <span className="last-activity-info">
                    {" - "}
                    <span className="last-comment-author">
                      {stock.lastComment.author}
                    </span>
                    :{" "}
                    <span className="last-comment-content">
                      {stock.lastComment.content}
                    </span>
                  </span>
                )}
              </>
            ) : (
              <Link to={`/stocks/${stock.symbol}`}>start discussion</Link>
            )}
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            <button
              className={`pagination-btn prev ${
                currentPage === 1 ? "disabled" : ""
              }`}
              onClick={goToPrevious}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>

            <div className="pagination-numbers">
              {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === "..." ? (
                    <span className="pagination-ellipsis">...</span>
                  ) : (
                    <button
                      className={`pagination-btn ${
                        currentPage === page ? "active" : ""
                      }`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            <button
              className={`pagination-btn next ${
                currentPage === totalPages ? "disabled" : ""
              }`}
              onClick={goToNext}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>

          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockTable;
