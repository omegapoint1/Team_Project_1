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
  const [reports_data, setReports] = useState([]);
  const [hotspots, setHotspots] = useState([]);


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

  useEffect(() => {
    const getHotspots = async () => {
      try {
        const hotspot_response = await fetch("/api/hotspots", {
          method: "GET",
        });
        const data = await hotspot_response.json();
        console.log(data.hotspots);
        setHotspots(data.hotspots || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
        console.error("Error fetching hotspots:", error);
      }
    };
    getHotspots();
  }, []);
useEffect(() => {
    const getReports = async () => {
      try {
        const report_response = await fetch("/api/report/get", {
          method: "GET",
        });
        const reportData = await report_response.json();

        const reports = reportData.map((report, index) => ({
          id: report.id || index,
          location: report.locationofnoise || report.location_of_noise || "Unknown",
          tags: report.tag_list || report.tags || [],
          time: Date.now(),
          severity: report.severity,
          status: report.approved,
          createdAt: report.datetime ? new Date(report.datetime).getTime() : Date.now(),
        }));  
        console.log(reports)

        setReports(reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    getReports();
  }, []);

  const sampleRequests = reports_data

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
  }, [search, status, timeRange, sampleRequests]);

  const onAccept = async (id) => {
    console.log("accept", id);
          const response = await fetch('/api/report/accept', {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          accepted: "Accepted"
        })
      });
  }
  const onReject = async(id) => {
    console.log("reject", id);
          const response = await fetch('/api/report/accept', {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          accepted: "Rejected"
        })
      });}
  const onViewMore = (id) => {
    console.log("view more", id);
  };

  /* Key stats */
  const keyStats = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const ms24h = dayMs;
    const ms7d = 7 * dayMs;
    const ms30d = 30 * dayMs;

    const in24h = sampleRequests.filter((r) => now - r.createdAt <= ms24h);
    const in7d = sampleRequests.filter((r) => now - r.createdAt <= ms7d);
    const in30d = sampleRequests.filter((r) => now - r.createdAt <= ms30d);

    const avgSeverity7d =
      in7d.length === 0
        ? 0
        : in7d.reduce((sum, r) => sum + (Number(r.severity) || 0), 0) / in7d.length;

    return {
      reports24h: in24h.length,
      reports7d: in7d.length,
      reports30d: in30d.length,
      avgSeverity7d,
    };
  }, [sampleRequests]);

  /* Top 4 most common tags */
  const topTags = useMemo(() => {
    const counts = new Map();

    for (const r of filteredRequests) {
      for (const rawTag of r.tags || []) {
        const tag = String(rawTag).trim();
        if (!tag) continue;

        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0]);
      })
      .slice(0, 4)
      .map(([tag, count]) => ({ tag, count }));
  }, [filteredRequests]);

  /* Action required count */
  const actionCounts = useMemo(() => {
    const counts = {
      pendingReview: 0,
      acceptedToday: 0,
      rejectedToday: 0,
    };

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    for (const r of filteredRequests) {
      const createdAt =
        typeof r.createdAt === "number"
          ? r.createdAt
          : new Date(r.createdAt).getTime();

      if (r.status === "Pending") {
        counts.pendingReview += 1;
      }

      const isLast24h = now - createdAt <= dayMs;

      if (isLast24h && r.status === "Accepted") {
        counts.acceptedToday += 1;
      }

      if (isLast24h && r.status === "Rejected") {
        counts.rejectedToday += 1;
      }
    }

    return counts;
  }, [filteredRequests]);




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
            <div className="statsRow">
              <span>Reports (24h):</span>
              <b>{keyStats.reports24h}</b>
            </div>
            <div className="statsRow">
              <span>Reports (7d):</span>
              <b>{keyStats.reports7d}</b>
            </div>
            <div className="statsRow">
              <span>Reports (30d):</span>
              <b>{keyStats.reports30d}</b>
            </div>
            <div className="statsRow">
              <span>Avg Severity (7d):</span>
              <b>{keyStats.avgSeverity7d.toFixed(1)}</b>
            </div>
          </div>
        </div>

        <div className="statsCard">
          <div className="statsTitle">Top Hotspots (Top 4)</div>

          {hotspots.length > 0 ? (
            <ol className="statsList">
              {hotspots.slice(0, 4).map((h, i) => (
                <li key={i}>
                  <span>{h[1]}</span>
                  <b>{h[0]} reports</b>
                </li>
              ))}
            </ol>
          ) : (
            <div className="statsBody">No hotspots data.</div>
          )}
        </div>

        <div className="statsCard">
          <div className="statsTitle">Common Tags</div>
          {topTags.length === 0 ? (
            <div className="statsBody">No tags in this selection.</div>
          ) : (
            <ol className="statsList">
              {topTags.map(({ tag, count }) => (
                <li key={tag}>
                  <span className="tagPill">{tag}</span>
                  <b>{count}</b>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="statsCard">
          <div className="statsTitle">Action Required</div>
          <div className="statsBody">
            <div className="statsRow">
              <span>Pending Review:</span>
              <b>{actionCounts.pendingReview}</b>
            </div>

            <div className="statsRow">
              <span>Accepted Today:</span>
              <b>{actionCounts.acceptedToday}</b>
            </div>

            <div className="statsRow">
              <span>Rejected Today:</span>
              <b>{actionCounts.rejectedToday}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewPage;