import React, { useMemo, useState } from "react";
import MapBackground from "../components/MapBackground";
import "./HotspotAnalytics.css";

const mockHotspots = [
  {
    id: "h1",
    zone: "St Davids Station",
    tags: ["Train", "Crowd"],
    peak: "21:00–23:00",
    avgSeverity: 6.4,
    reports: [
      { id: "R0001", noiseType: "Traffic", severity: 6, date: "26/01/26", status: "Accepted" },
      { id: "R0002", noiseType: "Music", severity: 2, date: "26/01/26", status: "Accepted" },
      { id: "R0067", noiseType: "Traffic", severity: 7, date: "27/01/26", status: "New" },
    ],
  },
  {
    id: "h2",
    zone: "Western Way",
    tags: ["Traffic", "Music"],
    peak: "17:00–19:00",
    avgSeverity: 5.8,
    reports: [
      { id: "R0120", noiseType: "Traffic", severity: 5, date: "25/01/26", status: "Accepted" },
      { id: "R0123", noiseType: "Music", severity: 7, date: "26/01/26", status: "New" },
    ],
  },
  {
    id: "h3",
    zone: "New North Road",
    tags: ["Cars"],
    peak: "18:00–20:00",
    avgSeverity: 4.9,
    reports: [{ id: "R0201", noiseType: "Traffic", severity: 4, date: "24/01/26", status: "Accepted" }],
  },
];

function HotspotRowButton({ hotspot, isActive, onSelect }) {
  return (
    <button
      type="button"
      className={`hotspotAnalyticsTopHotspotBtn ${isActive ? "isActive" : ""}`}
      onClick={() => onSelect(hotspot.id)}
      aria-pressed={isActive}
    >
      <span className="hotspotAnalyticsTopHotspotName">{hotspot.zone}</span>
      <span className="hotspotAnalyticsTopHotspotMeta">{hotspot.reports.length} reports</span>
    </button>
  );
}

export default function HotspotAnalytics() {
  const [search, setSearch] = useState("");
  const [timeRange, setTimeRange] = useState("24h");
  const [severity, setSeverity] = useState("All");
  const [tag, setTag] = useState("All");
  const [sort, setSort] = useState("Most reports");
  const [selectedHotspotId, setSelectedHotspotId] = useState(mockHotspots[0]?.id ?? null);

  const allTags = useMemo(() => {
    const s = new Set();
    mockHotspots.forEach((h) => h.tags.forEach((t) => s.add(t)));
    return ["All", ...Array.from(s)];
  }, []);

  const filteredHotspots = useMemo(() => {
    let list = [...mockHotspots];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((h) => h.zone.toLowerCase().includes(q));
    }

    if (severity !== "All") {
      const min = severity === "Low" ? 0 : severity === "Medium" ? 4 : 7;
      const max = severity === "Low" ? 3 : severity === "Medium" ? 6 : 10;
      list = list.filter((h) => h.avgSeverity >= min && h.avgSeverity <= max);
    }

    if (tag !== "All") {
      list = list.filter((h) => h.tags.includes(tag));
    }


    if (sort === "Most reports") {
      list.sort((a, b) => b.reports.length - a.reports.length);
    } else if (sort === "Highest severity") {
      list.sort((a, b) => b.avgSeverity - a.avgSeverity);
    } else if (sort === "A–Z") {
      list.sort((a, b) => a.zone.localeCompare(b.zone));
    }

    return list;
  }, [search, severity, tag, sort, timeRange]);

  const selectedHotspot =
    filteredHotspots.find((h) => h.id === selectedHotspotId) ||
    mockHotspots.find((h) => h.id === selectedHotspotId) ||
    null;

  const topHotspots = filteredHotspots.slice(0, 4);

  const hotspotSummary = useMemo(() => {
    const reports = filteredHotspots.reduce((acc, h) => acc + h.reports.length, 0);
    const hotspots = filteredHotspots.length;
    const avgSeverity =
      hotspots === 0 ? "-" : (filteredHotspots.reduce((acc, h) => acc + h.avgSeverity, 0) / hotspots).toFixed(1);
    return { reports, hotspots, avgSeverity };
  }, [filteredHotspots]);

  return (
    <div className="hotspotAnalyticsPage">
      {/* Filter bar */}
      <div className="hotspotAnalyticsFilterBar">
        <div className="hotspotAnalyticsSearchWrap">
          <input
            className="hotspotAnalyticsSearchInput"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            aria-label="Search hotspots"
          />
        </div>

        <div className="hotspotAnalyticsFilterRight">
          <div className="hotspotAnalyticsSelectorWrap">
            <select
              className="hotspotAnalyticsSelect"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              aria-label="Time range"
            >
              <option value="24h">Time Range</option>
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>

          <div className="hotspotAnalyticsSelectorWrap">
            <select
              className="hotspotAnalyticsSelect"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              aria-label="Severity"
            >
              <option value="All">Severity</option>
              <option value="All">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="hotspotAnalyticsSelectorWrap">
            <select className="hotspotAnalyticsSelect" value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Tags">
              <option value="All">Tags</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="hotspotAnalyticsSelectorWrap">
            <select className="hotspotAnalyticsSelect" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
              <option value="Most reports">Sort</option>
              <option value="Most reports">Most reports</option>
              <option value="Highest severity">Highest severity</option>
              <option value="A–Z">A–Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="hotspotAnalyticsMainGrid">
        <div className="hotspotAnalyticsMapCard">
          <MapBackground />
        </div>

        <div className="hotspotAnalyticsSide">
          <div className="hotspotAnalyticsSelectedCard">
            <div className="hotspotAnalyticsCardTitle">Selected Hotspot Summary</div>

            {selectedHotspot ? (
              <div className="hotspotAnalyticsSelectedBody">
                <div className="hotspotAnalyticsSelectedRow">
                  <span className="hotspotAnalyticsLabel">Zone</span>
                  <span className="hotspotAnalyticsValue">{selectedHotspot.zone}</span>
                </div>
                <div className="hotspotAnalyticsSelectedRow">
                  <span className="hotspotAnalyticsLabel">Tags</span>
                  <span className="hotspotAnalyticsValue">
                    {selectedHotspot.tags.map((t) => (
                      <span key={t} className="hotspotAnalyticsTagPill">
                        {t}
                      </span>
                    ))}
                  </span>
                </div>
                <div className="hotspotAnalyticsSelectedRow">
                  <span className="hotspotAnalyticsLabel">Peak</span>
                  <span className="hotspotAnalyticsValue">{selectedHotspot.peak}</span>
                </div>
                <div className="hotspotAnalyticsSelectedRow">
                  <span className="hotspotAnalyticsLabel">Average Severity</span>
                  <span className="hotspotAnalyticsValue">{selectedHotspot.avgSeverity}</span>
                </div>
              </div>
            ) : (
              <p className="hotspotAnalyticsEmptyText">Select a hotspot to see its summary.</p>
            )}
          </div>

          <div className="hotspotAnalyticsRightStack">
            <div className="hotspotAnalyticsCard">
              <div className="hotspotAnalyticsCardTitle centered">Top Hotspots</div>

              {topHotspots.length === 0 ? (
                <p className="hotspotAnalyticsEmptyText">No hotspots in this view.</p>
              ) : (
                <div className="hotspotAnalyticsTopHotspotsList">
                  {topHotspots.map((h) => (
                    <HotspotRowButton
                      key={h.id}
                      hotspot={h}
                      isActive={h.id === selectedHotspotId}
                      onSelect={setSelectedHotspotId}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="hotspotAnalyticsCard">
              <div className="hotspotAnalyticsCardTitle centered">Hotspot Summary</div>

              <div className="hotspotAnalyticsSummaryBody">
                <div className="hotspotAnalyticsSummaryRow">
                  <span>Reports</span>
                  <b>{hotspotSummary.reports}</b>
                </div>
                <div className="hotspotAnalyticsSummaryRow">
                  <span>Hotspots</span>
                  <b>{hotspotSummary.hotspots}</b>
                </div>
                <div className="hotspotAnalyticsSummaryRow">
                  <span>Average Severity</span>
                  <b>{hotspotSummary.avgSeverity}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports table */}
      <div className="hotspotAnalyticsTableCard">
        <div className="hotspotAnalyticsTableTitle">Selected Hotspot Reports</div>

        {!selectedHotspot ? (
          <p className="hotspotAnalyticsEmptyText">Select a hotspot to view its reports.</p>
        ) : selectedHotspot.reports.length === 0 ? (
          <p className="hotspotAnalyticsEmptyText">No reports for this hotspot.</p>
        ) : (
          <div className="hotspotAnalyticsTableWrap">
            <table className="hotspotAnalyticsTable">
              <thead>
                <tr>
                  <th>ReportID</th>
                  <th>Noise Type</th>
                  <th>Severity</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedHotspot.reports.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.noiseType}</td>
                    <td>{r.severity}</td>
                    <td>{r.date}</td>
                    <td>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
