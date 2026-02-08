import React, { useState } from "react";
import MapBackground from "../components/MapBackground";
import "./Dashboard_Overview.css";

function OverviewPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [timeRange, setTimeRange] = useState("24h");

  const handleSearch = () => {
    console.log("Searching for:", search);
  };

  return (
    <div className= "overviewPage">
      <div className= "filterBar">
        <div className= "searchWrap">
          <input
            className= "searchInput"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder= "Search by location..."
            aria-label= "Search"
          />
        </div>

        <div className= "filterRight">
          <div className= "selectorWrap">
            <select
              className= "select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label= "Filter by status"
            >
              <option value= "All">All</option>
              <option value= "Pending">Pending</option>
              <option value= "Accepted">Accepted</option>
              <option value= "Rejected">Rejected</option>
            </select>
          </div>

          <div className= "selectorWrap">
            <select
              className= "select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              aria-label= "Filter by time range"
            >
              <option value= "24h">Last 24h</option>
              <option value= "7d">Last 7 days</option>
              <option value= "30d">Last 30 days</option>
            </select>
          </div>
        </div>
      </div>


      <div className= "mainRow">
        <div className= "mapcard">
          <MapBackground />
        </div>

        <div className= "reportsSection">
          <div className= "sideScroll">
            <div className= "reportCard">Example report 1</div>
            <div className= "reportCard">Example report 2</div>
            <div className= "reportCard">Example report 3</div>
          </div>
        </div>
      </div>

      <div className= "analyticsSection">
        <div className= "statsCard">Key Statistics</div>
        <div className= "statsCard">Top Hotspots</div>
        <div className= "statsCard">Common Tags</div>
        <div className= "statsCard">Action Required</div>
      </div>
    </div>
  );
}

export default OverviewPage;
