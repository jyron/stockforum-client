import { Link } from "react-router-dom";

import "./StockBanner.css";

const StockBanner = ({
  stocks
}: any) => {
  return (
    <div className="stock-banner">
      <div className="stock-banner-scroll">
        {/* First set of stocks */}
        {stocks.map((stock: any) => <Link
          className="stock-banner-item"
          key={`first-${stock._id}`}
          to={`/stocks/${stock.symbol}`}
        >
          <div className="stock-symbol">{stock.symbol}</div>
          <div className="stock-price">
            ${stock.currentPrice?.toFixed(2) || "N/A"}
          </div>
          <div
            className={`stock-change ${
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
          </div>
        </Link>)}
        {/* Duplicate set of stocks for seamless scrolling */}
        {stocks.map((stock: any) => <Link
          className="stock-banner-item"
          key={`second-${stock._id}`}
          to={`/stocks/${stock.symbol}`}
        >
          <div className="stock-symbol">{stock.symbol}</div>
          <div className="stock-price">
            ${stock.currentPrice?.toFixed(2) || "N/A"}
          </div>
          <div
            className={`stock-change ${
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
          </div>
        </Link>)}
      </div>
    </div>
  );
};

export default StockBanner;
