import React from "react";
import "./SectorFilter.css";

const SECTORS = [
  "All Sectors",
  "Technology",
  "Industrials",
  "Financial Services",
  "Healthcare",
  "Consumer Cyclical",
  "Consumer Defensive",
  "Utilities",
  "Real Estate",
  "Energy",
  "Communication Services",
  "Basic Materials",
];

const SectorFilter = ({ selectedSector, onSectorChange }) => {
  return (
    <div className="sector-filter">
      <select
        value={selectedSector}
        onChange={(e) => onSectorChange(e.target.value)}
        className="sector-select"
      >
        {SECTORS.map((sector) => (
          <option key={sector} value={sector === "All Sectors" ? "" : sector}>
            {sector}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SectorFilter;
