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

const SectorFilter = ({
  onSectorChange,
  selectedSector
}: any) => {
  return (
    <div className="sector-filter">
      <select
        className="sector-select"
        onChange={(e: any) => onSectorChange(e.target.value)}
        value={selectedSector}
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
