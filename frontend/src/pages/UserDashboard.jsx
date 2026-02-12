import React, { useEffect, useState } from "react";
import MapBackground from "../components/MapBackground";
import "./UserDashboard.css";

function HotspotCard({ hotspot, onZoom, onExport }) {
    return (
        <div className="userDashboardHotspotCard">
            <div className="userDashboardHotspotLeft">
                <div className="userDashboardHotspotTitle">{hotspot.area}</div>

                <div className="userDashboardHotspotMeta">
                    <div className="userDashboardHotspotMetaRow">
                        <span className="userDashboardHotspotLabel">Severity:</span> {hotspot.severity}
                    </div>
                    <div className="userDashboardHotspotMetaRow">
                        <span className="userDashboardHotspotLabel">Reports (24h):</span> {hotspot.reports24h}
                    </div>
                    <div className="userDashboardHotspotMetaRow">
                        <span className="userDashboardHotspotLabel">Peak time:</span> {hotspot.peakTime}
                    </div>
                </div>

                <div className="userDashboardHotspotTagsRow">
                    <span className="userDashboardHotspotLabel">Top tag:</span>
                    <div className="userDashboardHotspotTags">
                        {(hotspot.topTags ?? []).slice(0, 2).map((t) => (
                        <span key={t} className="userDashboardHotspotTagPill">
                        {t}
                        </span>
                        ))}
                    </div>
                </div>
            </div>

        <div className="userDashboardHotspotActions">
            <button className="userDashboardHotspotBtn" type="button" onClick={() => onZoom(hotspot)}>
                Zoom to Hotspot
            </button>
            <button className="userDashboardHotspotBtn" type="button" onClick={() => onExport(hotspot)}>
                Export
            </button>
        </div>
    </div>
    );
}


function UserDashboard() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [timeRange, setTimeRange] = useState("24h");

    const [selectedHotspotId, setSelectedHotspotId] = useState(null);

  // Bottom-cards summary (NOT tied to filters)
    const [summary, setSummary] = useState({
        keyStats: { reports24h: 18, reports7d: 96, avgSeverity7d: 6.4, mostActiveZone: "St Davids Station" },
        topHotspots: [
            { name: "St Davids Station", count: 18 },
            { name: "Western Way", count: 12 },
            { name: "New North Road", count: 9 },
            { name: "Stocker Rd", count: 7 }
        ],
        commonTags: ["Train", "Cars", "Music", "Crowd"],
        updates: [{ id: 1, message: "Backend summary endpoint not wired yet." }]
    });
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState("");
    const summaryToRender = summary;

    const hotspotData = [
        { id: 1, area: "Exeter, St. Davids Station", severity: 8, reports24h: 18, peakTime: "21:00–23:00", topTags: ["Train", "Crowd"], lat: 50.729, lng: -3.541 },
        { id: 2, area: "Exeter, Western Way", severity: 7, reports24h: 12, peakTime: "17:00–19:00", topTags: ["Traffic", "Music"], lat: 50.723, lng: -3.533 },
        { id: 3, area: "Exeter, New North Road", severity: 5, reports24h: 9, peakTime: "18:00–20:00", topTags: ["Cars"], lat: 50.735, lng: -3.53 },
        { id: 4, area: "Exeter, Stocker Road", severity: 4, reports24h: 7, peakTime: "15:00–17:00", topTags: ["Crowd", "Music"], lat: 50.724, lng: -3.524 },
    ];

    const filteredHotspots = hotspotData.filter((h) =>
        search.trim()
        ? h.area.toLowerCase().includes(search.trim().toLowerCase())
        : true
    );

    const selectedHotspot = filteredHotspots.find((h) => h.id === selectedHotspotId) || null;

    const handleZoomToHotspot = (hotspot) => {
        setSelectedHotspotId(hotspot.id);
        console.log("Zoom to hotspot:", hotspot);

        // If MapBackground supports props later, we’ll pass:
        // <MapBackground center={[hotspot.lat, hotspot.lng]} zoom={16} />
};

const handleExportHotspot = (hotspot) => {
    console.log("Export hotspot:", hotspot);
    // later: call backend: /api/hotspots/:id/export
    alert(`Export not wired yet for: ${hotspot.area}`);
};




    const handleSearch = () => {
        console.log("Searching for:", search);
    };

    /* useEffect(() => {
        let cancelled = false;

        async function loadSummary() {
            setSummaryLoading(true);
            setSummaryError("");

        try {
            const res = await fetch("/api/dashboard/summary");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            if (!cancelled) setSummary(data);
        } catch (e) {
            if (!cancelled) setSummaryError("Could not load dashboard summary.");
        } finally {
        if (!cancelled) setSummaryLoading(false);
        }
    }

    loadSummary();
    return () => {
        cancelled = true;
    };
    }, []);
*/
    const renderSummaryState = (emptyText) => {
        if (summaryLoading) return <p className="userDashboardEmptyText">Loading…</p>;
        if (summaryError) return <p className="userDashboardEmptyText">{summaryError}</p>;
        if (!summaryToRender) return <p className="userDashboardEmptyText">{emptyText}</p>;
        return null;
    };

    return (
    <div className="userDashboardPage">
      {/* Filter bar (map/overview only) */}
        <div className="userDashboardFilterBar">
            <div className="userDashboardSearchWrap">
                <input
                className="userDashboardSearchInput"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
                }}
                placeholder="Search by location..."
                aria-label="Search"
            />
        </div>

        <div className="userDashboardFilterRight">
            <div className="userDashboardSelectorWrap">
                <select
                    className="userDashboardSelect"
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

            <div className="userDashboardSelectorWrap">
            <select
                className="userDashboardSelect"
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

      {/* Main row: map + right panel */}
    <div className="userDashboardMainRow">
        <div className="userDashboardMapCard">
            <MapBackground />
        </div>

        <div className="userDashboardRightPanel">
            <div className="userDashboardRightPanelInner">
                <div className="userDashboardPanelTitle">Hotspot View</div>

                {filteredHotspots.length === 0 ? (
                <p className="userDashboardEmptyText">No hotspots match your search.</p>
                ) : (
                filteredHotspots.map((h) => (
                    <HotspotCard
                    key={h.id}
                    hotspot={h}
                    onZoom={handleZoomToHotspot}
                    onExport={handleExportHotspot}
                    />
                ))
                )}
            </div>
        </div>
    </div>

      {/* Bottom 4 cards (fed by /api/dashboard/summary) */}
    <div className="userDashboardCardsRow">
        {/* Key Statistics */}
        <div className="userDashboardInfoCard">
            <div className="userDashboardCardTitle">Key Statistics</div>

            {renderSummaryState("Not available yet.")}

            {!summaryLoading && !summaryError && summary?.keyStats && (
            <div className="userDashboardStatsBody">
                <div className="userDashboardStatsRow">
                    <span>Reports (24h):</span>
                    <b>{summary.keyStats.reports24h ?? "-"}</b>
                </div>
                <div className="userDashboardStatsRow">
                    <span>Reports (7d):</span>
                    <b>{summary.keyStats.reports7d ?? "-"}</b>
                </div>
                <div className="userDashboardStatsRow">
                    <span>Avg Severity (7d):</span>
                    <b>{summary.keyStats.avgSeverity7d ?? "-"}</b>
                </div>
                <div className="userDashboardStatsRow">
                    <span>Most Active Zone:</span>
                    <b>{summary.keyStats.mostActiveZone ?? "-"}</b>
                </div>
            </div>
            )}
        </div>

        {/* Top Hotspots */}
        <div className="userDashboardInfoCard">
            <div className="userDashboardCardTitle">Top Hotspots</div>

            {renderSummaryState("Not available yet.")}

            {!summaryLoading && !summaryError && Array.isArray(summary?.topHotspots) && (
            <ol className="userDashboardList">
                {summary.topHotspots.slice(0, 4).map((h, idx) => (
                    <li key={h.id ?? h.name ?? idx} className="userDashboardListItem">
                    <span>{h.name ?? "-"}</span>
                    <b>{h.count ?? "-"}</b>
                    </li>
                ))}
            </ol>
            )}
        </div>

        {/* Common Tags */}
        <div className="userDashboardInfoCard">
            <div className="userDashboardCardTitle">Common Tags</div>

            {renderSummaryState("Not available yet.")}

            {!summaryLoading && !summaryError && Array.isArray(summary?.commonTags) && (
            <div className="userDashboardTagWrap">
                {summary.commonTags.slice(0, 4).map((t, idx) => {
                    const label = typeof t === "string" ? t : t.tag;
                return (
                    <span key={label ?? idx} className="userDashboardTagPill">
                        {label ?? "-"}
                    </span>
                );
                })}
            </div>
            )}
        </div>

        {/* Updates */}
        <div className="userDashboardInfoCard">
            <div className="userDashboardCardTitle">Updates</div>

            {renderSummaryState("Nothing to show yet.")}

            {!summaryLoading && !summaryError && Array.isArray(summary?.updates) && (
                summary.updates.length > 0 ? (
                <ul className="userDashboardUpdates">
                    {summary.updates.slice(0, 3).map((u, idx) => (
                    <li key={u.id ?? idx} className="userDashboardUpdateItem">
                        {u.message ?? "-"}
                    </li>
                    ))}
                </ul>
            ) : (
                <p className="userDashboardEmptyText">Nothing to show yet.</p>
                )
            )}
            </div>
        </div>
    </div>
    );
}

export default UserDashboard;
