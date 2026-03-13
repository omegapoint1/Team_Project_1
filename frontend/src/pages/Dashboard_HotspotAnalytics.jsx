import React, { useEffect, useMemo, useState } from "react";
import MapModule from "../components/map/MapModule";
import "./HotspotAnalytics.css";

// Helpers to map backend -> UI
function formatDate(backendRecordedAt) {
  // backend gives "2025-08-17 08:23:00"
  if (!backendRecordedAt) return "-";
  const datePart = backendRecordedAt.split(" ")[0]; // "2025-08-17"
  const [y, m, d] = datePart.split("-");
  if (!y || !m || !d) return backendRecordedAt;
  return `${d}/${m}/${y.slice(2)}`; // "17/08/25"
}

function normaliseStatus(_backendReport) {
  return "New";
}

function normaliseNoiseType(r) {
  return r?.noisetype ?? "-";
}

function normaliseSeverity(r) {
  const n = Number(r?.severity);
  return Number.isFinite(n) ? n : "-";
}

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

  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedHotspotId, setSelectedHotspotId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHotspots() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/hotspots");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        const list = Array.isArray(data?.hotspots) ? data.hotspots : [];

        const mapped = list.map((h) => {
          const reports = Array.isArray(h?.reports) ? h.reports : [];

        
          const peak = "—"; //incomplete for now

          const tagSet = new Set();
          reports.forEach((r) => {
            if (r?.noisetype) tagSet.add(String(r.noisetype));
          });

          const tags = Array.from(tagSet);

          return {
            id: String(h?.id ?? ""),
            zone: h?.name ?? "Unknown hotspot",
            tags,
            peak,
            avgSeverity: Number(h?.severity ?? 0),
            reports: reports.map((r) => ({
              id: String(r?.id ?? ""),
              noiseType: normaliseNoiseType(r),
              severity: normaliseSeverity(r),
              date: formatDate(r?.recordedat),
              status: normaliseStatus(r),
              description: r?.description ?? "",
              recordedAt: r?.recordedat ?? "",
            })),
            geometry: h?.geometry ?? null,
          };
        });

        if (!cancelled) {
          setHotspots(mapped);
          setSelectedHotspotId((prev) => prev ?? (mapped[0]?.id ?? null));
        }
      } catch (e) {
        if (!cancelled) setError("Could not load hotspots from /api/hotspots.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadHotspots();
    return () => {
      cancelled = true;
    };
  }, []);

  const allTags = useMemo(() => {
    const s = new Set();
    hotspots.forEach((h) => (h.tags || []).forEach((t) => s.add(t)));
    return ["All", ...Array.from(s)];
  }, [hotspots]);

  const filteredHotspots = useMemo(() => {
    let list = [...hotspots];

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
      list = list.filter((h) => (h.tags || []).includes(tag));
    }

    if (sort === "Most reports") {
      list.sort((a, b) => b.reports.length - a.reports.length);
    } else if (sort === "Highest severity") {
      list.sort((a, b) => b.avgSeverity - a.avgSeverity);
    } else if (sort === "A–Z") {
      list.sort((a, b) => a.zone.localeCompare(b.zone));
    }

    return list;
  }, [hotspots, search, severity, tag, sort, timeRange]);

  const selectedHotspot =
    filteredHotspots.find((h) => h.id === selectedHotspotId) ||
    hotspots.find((h) => h.id === selectedHotspotId) ||
    null;

  const topHotspots = filteredHotspots.slice(0, 4);

  const hotspotSummary = useMemo(() => {
    const reports = filteredHotspots.reduce((acc, h) => acc + h.reports.length, 0);
    const hotspotsCount = filteredHotspots.length;
    const avgSeverity =
      hotspotsCount === 0
        ? "-"
        : (
            filteredHotspots.reduce((acc, h) => acc + (Number(h.avgSeverity) || 0), 0) /
            hotspotsCount
          ).toFixed(1);

    return { reports, hotspots: hotspotsCount, avgSeverity };
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
            <select
              className="hotspotAnalyticsSelect"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              aria-label="Tags"
            >
              <option value="All">Tags</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="hotspotAnalyticsSelectorWrap">
            <select
              className="hotspotAnalyticsSelect"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort"
            >
              <option value="Most reports">Sort</option>
              <option value="Most reports">Most reports</option>
              <option value="Highest severity">Highest severity</option>
              <option value="A–Z">A–Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* State messages */}
      {loading && <p className="hotspotAnalyticsEmptyText">Loading hotspots…</p>}
      {!loading && error && <p className="hotspotAnalyticsEmptyText">{error}</p>}

      {/* Main grid */}
      <div className="hotspotAnalyticsMainGrid">
        <div className="hotspotAnalyticsMapCard">
          <MapModule />
        </div>

        <div className="hotspotAnalyticsSide">
          <div className="hotspotAnalyticsSelectedCard">
            <div className="hotspotAnalyticsCardTitle">Selected Hotspot Summary</div>

            {!selectedHotspot ? (
              <p className="hotspotAnalyticsEmptyText">Select a hotspot to see its summary.</p>
            ) : (
              <div className="hotspotAnalyticsSelectedBody">
                <div className="hotspotAnalyticsSelectedRow">
                  <span className="hotspotAnalyticsLabel">Zone</span>
                  <span className="hotspotAnalyticsValue">{selectedHotspot.zone}</span>
                </div>

                <div className="hotspotAnalyticsSelectedRow">
                  <span className="hotspotAnalyticsLabel">Tags</span>
                  <span className="hotspotAnalyticsValue">
                    {(selectedHotspot.tags || []).length === 0 ? (
                      <span>-</span>
                    ) : (
                      selectedHotspot.tags.map((t) => (
                        <span key={t} className="hotspotAnalyticsTagPill">
                          {t}
                        </span>
                      ))
                    )}
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
