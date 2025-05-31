import React, { useState } from "react";
import StockTable from "../components/StockTable";
import "../styles/Craigslist.css";
import "../styles/components.css";

const Home = ({ stocks, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      <header className="main-header">
        <div className="header-content">
          <img
            src="/logo192.png"
            alt="StockForum Logo"
            className="header-logo"
          />
          <div>
            <h1>stock forum | discussions</h1>
            <p className="tagline">discuss stocks with the community</p>
          </div>
        </div>
      </header>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="AAPL, GOOGL..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {filteredStocks.length === 0 ? (
        <div className="no-stocks">
          No stocks found matching your search criteria.
        </div>
      ) : (
        <StockTable stocks={filteredStocks} onUpdate={onUpdate} />
      )}
    </div>
  );
};

export default Home;
