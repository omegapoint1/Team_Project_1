import React, { useMemo, useState, useEffect } from "react";
import MapModule from "../components/map/MapModule";
import "./Dashboard_Overview.css";

/* This function is responsible for recieving data from the backend and creating a single object of a card. */
function RequestCard({ req, onAccept, onReject, onViewMore }) {
  return (
    <div className="requestCard">
      <div className="requestLeft">
        <div className="requestTitle">{req.location}</div>
        <div className="requestTagsRow">
          <span className="requestLabel">Tags:</span>
          <div className="requestTags">
            {req.tags.map((t) => (
              <span key={t} className="requestTag">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="requestMeta">
          <div className="requestMetaRow">
            <span className="requestLabel">Time:</span> {req.time}
          </div>
          <div className="requestMetaRow">
            <span className="requestLabel">Severity:</span> {req.severity}
          </div>
        </div>
      </div>

      <div className="requestActions">
        <button
          className="requestBtn"
          onClick={() => onAccept(req.id)}
          type="button"
        >
          Accept
        </button>
        <button
          className="requestBtn"
          onClick={() => onReject(req.id)}
          type="button"
        >
          Reject
        </button>
        <button
          className="requestBtn"
          onClick={() => onViewMore(req.id)}
          type="button"
        >
          View More
        </button>
      </div>
    </div>
  );
}

function OverviewPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [timeRange, setTimeRange] = useState("24h");

  const [noiseReports, setNoiseReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoiseReports = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/noise-data');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let parsedData;

        // Check if it's GeoJSON format
        if (data.type === 'FeatureCollection' && data.features) {
          // Parse GeoJSON
          parsedData = data.features.map(feature => ({
            lat: feature.geometry.coordinates[1],
            long: feature.geometry.coordinates[0],
            decibels: feature.properties.decibels,
            time: feature.properties.time,
            category: feature.properties.category
          }));
        } else {
          // assume its in the right format
          parsedData = data;
        }

        setNoiseReports(parsedData);
      } catch (err) {
        console.error('Error fetching noise reports:', err);
        console.log('Falling back to mock data');
        setNoiseReports(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNoiseReports();
  }, []);

  const sampleRequests = [
    {
      id: 1,
      location: "Exeter, St. Davids Station",
      tags: ["Train", "Crowd"],
      time: "15:00",
      severity: 8,
      status: "Pending",
      createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2h
    },
    {
      id: 2,
      location: "Exeter, Western Way",
      tags: ["Traffic", "Music"],
      time: "17:25",
      severity: 7,
      status: "Pending",
      createdAt: Date.now() - 10 * 60 * 60 * 1000, // 10h
    },
    {
      id: 3,
      location: "Exeter, New North Road",
      tags: ["Train", "Cars"],
      time: "16:17",
      severity: 4,
      status: "Accepted",
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3d
    },
    {
      id: 4,
      location: "Exeter, Stocker Road",
      tags: ["Crowd", "Music"],
      time: "15:00",
      severity: 5,
      status: "Rejected",
      createdAt: Date.now() - 20 * 60 * 60 * 1000, // 20h
    },
  ];

  const handleSearch = () => {
    console.log("Searching for:", search);
  };
  const filteredRequests = useMemo(() => {
    const now = Date.now();

    const rangeMs =
      timeRange === "24h"
        ? 24 * 60 * 60 * 1000
        : timeRange === "7d"
          ? 7 * 24 * 60 * 60 * 1000
          : 30 * 24 * 60 * 60 * 1000;

    return sampleRequests
      .filter((r) => now - r.createdAt <= rangeMs)
      .filter((r) => (status === "All" ? true : r.status === status))
      .filter((r) =>
        search.trim()
          ? r.location.toLowerCase().includes(search.trim().toLowerCase())
          : true
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [search, status, timeRange]);

  const onAccept = (id) => console.log("accept", id);
  const onReject = (id) => console.log("reject", id);
  const onViewMore = (id) => console.log("view more", id);

  return (
    <div className="overviewPage">
      <div className="filterBar">
        <div className="searchWrap">
          <input
            className="searchInput"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search by location..."
            aria-label="Search"
          />
        </div>

        <div className="filterRight">
          <div className="selectorWrap">
            <select
              className="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="selectorWrap">
            <select
              className="select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              aria-label="Filter by time range"
            >
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mainRow">
        <div className="mapcard">
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              fontSize: '18px',
              color: '#666'
            }}>
              Loading noise data...
            </div>
          ) : (
            <MapModule
              noiseData={noiseReports}
              showControls={true}
            />
          )}
        </div>

        <div className="reportsSection">
          <div className="sideScroll">
            {filteredRequests.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                onAccept={onAccept}
                onReject={onReject}
                onViewMore={onViewMore}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="analyticsSection">
        <div className="statsCard">
          <div className="statsTitle">Key Statistics</div>
          <div className="statsBody">
            <div className="statsRow"><span>Reports (24h):</span><b>18</b></div>
            <div className="statsRow"><span>Reports (7d):</span><b>96</b></div>
            <div className="statsRow"><span>Avg Severity (7d):</span><b>6.4</b></div>
            <div className="statsRow"><span>Most Active Zone:</span><b>St Davids Station</b></div>
          </div>
        </div>

        <div className="statsCard">
          <div className="statsTitle">Top Hotspots (Top 4)</div>
          <ol className="statsList">
            <li><span>St Davids Station</span><b>18 reports</b></li>
            <li><span>Western Way</span><b>12 reports</b></li>
            <li><span>New North Road</span><b>9 reports</b></li>
            <li><span>Stocker Rd</span><b>7 reports</b></li>
          </ol>
        </div>

        <div className="statsCard">
          <div className="statsTitle">Common Tags</div>
          <ol className="statsList">
            <li><span className="tagPill">Train</span></li>
            <li><span className="tagPill">Cars</span></li>
            <li><span className="tagPill">Music</span></li>
            <li><span className="tagPill">Crowd</span></li>
          </ol>
        </div>

        <div className="statsCard">
          <div className="statsTitle">Action Required</div>
          <div className="statsBody">
            <div className="statsRow"><span>Pending Review:</span><b>7</b></div>
            <div className="statsRow"><span>Accepted Today:</span><b>11</b></div>
            <div className="statsRow"><span>Rejected Today:</span><b>2</b></div>
            <div className="statsRow"><span>Awaiting More Info:</span><b>3</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewPage;