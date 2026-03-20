import React, { useEffect, useMemo, useState } from "react";
import MapModule from "../components/map/MapModule";
import "./UserDashboard.css";



function parseBackendDate(dt) {
    if (!dt || typeof dt !== "string") return null;


    const direct = new Date(dt);
    if (!Number.isNaN(direct.getTime())) return direct;


    const m = dt.trim().match(/^(\d{1,2}):(\d{1,2})\s+(\d{1,2})[:/](\d{1,2})[:/](\d{2,4})$/);
    if (!m) return null;

    const a = Number(m[1]);
    const b = Number(m[2]);
    const day = Number(m[3]);
    const month = Number(m[4]);
    let year = Number(m[5]);
    if (year < 100) year += 2000;


    let hh = a;
    let mm = b;
    if (hh > 23 && mm <= 23) {
        hh = b;
        mm = a;
    }

    const d = new Date(year, month - 1, day, hh, mm, 0, 0);
    if (Number.isNaN(d.getTime())) return null;
    return d;
}

function fmtHour(h) {
    const hh = String(h).padStart(2, "0");
    return `${hh}:00`;
}

function countBy(list, keyFn) {
    const m = new Map();
    for (const item of list) {
        const k = keyFn(item);
        if (!k) continue;
        m.set(k, (m.get(k) ?? 0) + 1);
    }
    return m;
}

function topNFromMap(map, n) {
    return [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([name, count]) => ({ name, count }));
}

function normalizeReport(r) {

    console.log("normalizeReport raw:", r); // DEBUG
    const zone = r.zone ?? r.locationofnoise ?? r.location_of_noise ?? "";
    const location = r.location_of_noise ?? r.locationofnoise ?? "";
    const tags =
        Array.isArray(r.tags) ? r.tags
        : Array.isArray(r.tag_list) ? r.tag_list
        : Array.isArray(r.tagList) ? r.tagList
        : [];
    const noisetype = r.noisetype ?? r.noiseType ?? "";
    const severity = Number(r.severity ?? 0);


    const status = r.status ?? (r.approved === true ? "Accepted" : r.approved === false ? "Pending" : "Accepted");

    return {
        id: r.id ?? r.reportid ?? r.reportId ?? null,
        noisetype,
        datetime: r.datetime ?? "",
        dateObj: parseBackendDate(r.datetime),
        severity,
        description: r.description ?? "",
        tags,
        location_of_noise: location,
        zone,
        status,
    };
}

function UserDashboard() {
    // Filter bar states
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [timeRange, setTimeRange] = useState("24h");
    const [selectedZone, setSelectedZone] = useState("All");

    // Reports from backend
    const [reports, setReports] = useState([]);
    const [reportsLoading, setReportsLoading] = useState(true);
    const [reportsError, setReportsError] = useState("");

useEffect(() => {
    let cancelled = false;

    const USE_TEST_DATA = false; // set true to force local test data

    const TEST_REPORTS = [
        {
        id: "R1001",
        noisetype: "Traffic",
        datetime: "15:30 15:02:26",
        severity: 6,
        description: "Busy road",
        tags: ["Cars", "Rush hour"],
        location_of_noise: "Exeter, St Davids Station",
        zone: "St Davids Station",
        approved: true,
        },
        {
        id: "R1002",
        noisetype: "Music",
        datetime: "21:10 15:02:26",
        severity: 3,
        description: "Loud music nearby",
        tags: ["Music"],
        location_of_noise: "Exeter, St Davids Station",
        zone: "St Davids Station",
        approved: false,
        },
        {
        id: "R1003",
        noisetype: "Crowd",
        datetime: "18:05 14:02:26",
        severity: 5,
        description: "Crowd noise",
        tags: ["Crowd"],
        location_of_noise: "Exeter, Western Way",
        zone: "Western Way",
        approved: true,
        },
    ];

    async function loadReports() {
        setReportsLoading(true);
        setReportsError("");

        
        if (USE_TEST_DATA) {
        const list = TEST_REPORTS.map(normalizeReport);
        if (!cancelled) setReports(list);
        if (!cancelled) setReportsLoading(false);
        return;
        }

        
        try {
        const res = await fetch("/api/report/get");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const raw = await res.json(); 
        let list = Array.isArray(raw) ? raw.map(normalizeReport) : [];

        
        console.log("reports count:", list.length);
        console.log("first report normalized:", list[0]);
        console.log("tags sample (first 10):", list.slice(0, 10).map(r => r.tags));

        
        if (list.length === 0) list = TEST_REPORTS.map(normalizeReport);

        if (!cancelled) setReports(list);
        } catch (e) {
        
        if (!cancelled) {
            setReportsError("Backend unavailable — showing test data.");
            setReports(TEST_REPORTS.map(normalizeReport));
        }
        } finally {
        if (!cancelled) setReportsLoading(false);
        }
    }

    loadReports();
    return () => {
        cancelled = true;
    };
    }, []);

    const allZones = useMemo(() => {
    const s = new Set();
    for (const r of reports) {
        const z = String(r.zone ?? "").trim();
        if (z) s.add(z);
    }
    return ["All", ...Array.from(s).sort((a, b) => a.localeCompare(b))];
    }, [reports]);

    const zoneStats = useMemo(() => {
    const now = new Date();
    const cutoff24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const cutoff7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const scoped =
        selectedZone === "All"
        ? reports
        : reports.filter((r) => (r.zone ?? "").trim() === selectedZone);

    const dated = scoped.filter(
        (r) => r.dateObj instanceof Date && !Number.isNaN(r.dateObj.getTime())
    );

    const totalAllTime = scoped.length;
    const reports24h = dated.filter((r) => r.dateObj >= cutoff24h).length;

    const reports7dList = dated.filter((r) => r.dateObj >= cutoff7d);
    const reports7d = reports7dList.length;

    const avgSeverity7d =
        reports7d === 0
        ? "-"
        : (
            reports7dList.reduce((acc, r) => acc + (Number(r.severity) || 0), 0) /
            reports7d
            ).toFixed(1);

    const highSeverity7d = reports7dList.filter(
        (r) => (Number(r.severity) || 0) >= 7
    ).length;

    const typeCounts = countBy(scoped, (r) => String(r.noisetype ?? "").trim());
    const topTypes = topNFromMap(typeCounts, 3);

    const forPeak = reports7dList.length > 0 ? reports7dList : dated;
    let peakHour = "-";
    if (forPeak.length > 0) {
        const hourCounts = countBy(forPeak, (r) => r.dateObj.getHours());
        const best = [...hourCounts.entries()].sort((a, b) => b[1] - a[1])[0];
        if (best) peakHour = fmtHour(best[0]);
    }

    return {
        totalAllTime,
        reports24h,
        reports7d,
        avgSeverity7d,
        highSeverity7d,
        topTypes,
        peakHour,
    };
    }, [reports, selectedZone]);

    const filteredForPanel = useMemo(() => {
        let list = [...reports];

        const q = search.trim().toLowerCase();
        if (q) {
        list = list.filter((r) => {
            const hay = `${r.zone} ${r.location_of_noise} ${r.noisetype}`.toLowerCase();
            return hay.includes(q);
        });
        }

        if (status !== "All") {
            list = list.filter((r) => (r.status ?? "Accepted") === status);
        }

        
        const now = new Date();
        const ms =
            timeRange === "24h" ? 24 * 60 * 60 * 1000 :
            timeRange === "7d"  ? 7 * 24 * 60 * 60 * 1000 :
            timeRange === "30d" ? 30 * 24 * 60 * 60 * 1000 :
            null;

        if (ms != null) {
            const cutoff = new Date(now.getTime() - ms);
            list = list.filter((r) => r.dateObj && r.dateObj >= cutoff);
        }

        
        list.sort((a, b) => (b.dateObj?.getTime?.() ?? 0) - (a.dateObj?.getTime?.() ?? 0));
        return list;
    }, [reports, search, status, timeRange]);


    const summary = useMemo(() => {
        const now = new Date();
        const cutoff24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const cutoff7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const dated = reports.filter((r) => r.dateObj);
        const in24h = dated.filter((r) => r.dateObj >= cutoff24h);
        const in7d = dated.filter((r) => r.dateObj >= cutoff7d);

        const avgSeverity7d =
            in7d.length === 0 ? "-" : (in7d.reduce((acc, r) => acc + (r.severity || 0), 0) / in7d.length).toFixed(1);

    
    const zoneCounts = new Map();
    for (const r of reports) {
        const z = (r.zone || r.location_of_noise || "Unknown").trim() || "Unknown";
        zoneCounts.set(z, (zoneCounts.get(z) ?? 0) + 1);
    }
    const mostActiveZone =
        zoneCounts.size === 0
            ? "-"
            : [...zoneCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];

    
    const topHotspots = [...zoneCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([name, count]) => ({ name, count }));

    
    const tagCounts = new Map();
    for (const r of reports) {
        for (const t of r.tags ?? []) {
            const key = String(t).trim();
            if (!key) continue;
            tagCounts.set(key, (tagCounts.get(key) ?? 0) + 1);
        }
    }
    const commonTags = [...tagCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([tag]) => tag);

    
    const updates = [...dated]
        .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime())
        .slice(0, 3)
        .map((r, idx) => ({
            id: r.id ?? idx,
            message: `${r.zone || r.location_of_noise || "Unknown"} • ${r.noisetype || "Noise"} • severity ${r.severity || "-"}`,
        }));

    return {
        keyStats: {
            reports24h: in24h.length,
            reports7d: in7d.length,
            avgSeverity7d,
            mostActiveZone,
        },
        topHotspots,
        commonTags,
        updates,
    };
    }, [reports]);

    const renderReportsState = (emptyText) => {
        if (reportsLoading) return <p className="userDashboardEmptyText">Loading…</p>;
        if (reportsError) return <p className="userDashboardEmptyText">{reportsError}</p>;
        if (!reports || reports.length === 0) return <p className="userDashboardEmptyText">{emptyText}</p>;
        return null;
    };

    return (
        <div className="userDashboardPage">
        <div className="userDashboardFilterBar">
            <div className="userDashboardSearchWrap">
            <input
                className="userDashboardSearchInput"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by location / zone..."
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

        
        <div className="userDashboardMainRow">
            <div className="userDashboardMapCard">
                <MapModule />
            </div>

            <div className="userDashboardRightPanel">
            <div className="userDashboardRightPanelInner">
                <div className="userDashboardPanelSection">
                    <div className="userDashboardPanelTitle">Reports (filtered)</div>

                    {renderReportsState("No reports available yet.")}

                    {!reportsLoading && !reportsError && (
                    filteredForPanel.length === 0 ? (
                        <p className="userDashboardEmptyText">No reports match your filters.</p>
                    ) : (
                        <div className="userDashboardReportList">
                        {filteredForPanel.map((r, idx) => (
                            <div key={r.id ?? idx} className="userDashboardReportRow">
                            <div className="userDashboardReportMain">
                                <div className="userDashboardReportTitle">
                                {r.zone || r.location_of_noise || "Unknown"}
                                </div>

                                <div className="userDashboardReportMeta">
                                <span className="userDashboardPill userDashboardPillType">
                                    {r.noisetype || "Noise"}
                                </span>
                                <span className="userDashboardPill userDashboardPillSeverity">
                                    Sev {Number.isFinite(r.severity) ? r.severity : "-"}
                                </span>
                                <span className="userDashboardPill">
                                    {r.status || "Accepted"}
                                </span>
                                </div>
                            </div>

                            <div className="userDashboardReportRight">
                                <div className="userDashboardReportDate">
                                {r.datetime || "-"}
                                </div>
                            </div>
                            </div>
                        ))}
                        </div>
                    )
                    )}
                </div>

                <div className="userDashboardPanelSection userDashboardUpdatesPanel">
                    <div className="userDashboardCardTitle">Updates</div>

                    {renderReportsState("Nothing to show yet.")}

                    {!reportsLoading && !reportsError && (
                    summary.updates.length === 0 ? (
                        <p className="userDashboardEmptyText">Nothing to show yet.</p>
                    ) : (
                        <ul className="userDashboardUpdates">
                        {summary.updates.map((u, idx) => (
                            <li key={u.id ?? idx} className="userDashboardUpdateItem">
                            {u.message}
                            </li>
                        ))}
                        </ul>
                    )
                    )}
                </div>
                </div>
            </div>
        </div>

        {/* Bottom 4 cards made from all reports, not filtered  */}
        <div className="userDashboardCardsRow">
            <div className="userDashboardInfoCard">
            <div className="userDashboardCardTitle">Key Statistics</div>
            {renderReportsState("Not available yet.")}
            {!reportsLoading && !reportsError && (
                <div className="userDashboardStatsBody">
                <div className="userDashboardStatsRow">
                    <span>Reports (24h):</span>
                    <b>{summary.keyStats.reports24h}</b>
                </div>
                <div className="userDashboardStatsRow">
                    <span>Reports (7d):</span>
                    <b>{summary.keyStats.reports7d}</b>
                </div>
                <div className="userDashboardStatsRow">
                    <span>Avg Severity (7d):</span>
                    <b>{summary.keyStats.avgSeverity7d}</b>
                </div>
                <div className="userDashboardStatsRow">
                    <span>Most Active Zone:</span>
                    <b>{summary.keyStats.mostActiveZone}</b>
                </div>
                </div>
            )}
            </div>

            <div className="userDashboardInfoCard">
            <div className="userDashboardCardTitle">Top Hotspots (by zone count)</div>
            {renderReportsState("Not available yet.")}
            {!reportsLoading && !reportsError && (
                summary.topHotspots.length === 0 ? (
                <p className="userDashboardEmptyText">Not available yet.</p>
                ) : (
                <ol className="userDashboardList">
                    {summary.topHotspots.map((h, idx) => (
                    <li key={`${h.name}-${idx}`} className="userDashboardListItem">
                        <span>{h.name}</span>
                        <b>{h.count}</b>
                    </li>
                    ))}
                </ol>
                )
            )}
            </div>

            <div className="userDashboardInfoCard">
                <div className="userDashboardCardTitle">Common Tags</div>
                {renderReportsState("Not available yet.")}
                {!reportsLoading && !reportsError && (
                    summary.commonTags.length === 0 ? (
                    <p className="userDashboardEmptyText">Not available yet.</p>
                    ) : (
                    <div className="userDashboardTagWrap">
                        {summary.commonTags.map((t, idx) => (
                        <span key={`${t}-${idx}`} className="userDashboardTagPill">
                            {t}
                        </span>
                        ))}
                    </div>
                    )
                )}
                </div>
            </div>

            <div className="userDashboardZoneStatsRow">
                <div className="userDashboardZoneStatsCard">
                    <div className="userDashboardZoneStatsHeader">
                    <div>
                        <div className="userDashboardCardTitle">Zone Statistics</div>
                        <div className="userDashboardZoneStatsSub">
                        Pick a zone to see a quick breakdown.
                        </div>
                    </div>

                    <div className="userDashboardSelectorWrap userDashboardZoneSelectWrap">
                        <select
                        className="userDashboardSelect"
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.target.value)}
                        aria-label="Select zone"
                        >
                        {allZones.map((z) => (
                            <option key={z} value={z}>
                            {z}
                            </option>
                        ))}
                        </select>
                    </div>
                    </div>

                    {reportsLoading ? (
                    <p className="userDashboardEmptyText">Loading…</p>
                    ) : reportsError ? (
                    <p className="userDashboardEmptyText">{reportsError}</p>
                    ) : (
                    <div className="userDashboardZoneStatsGrid">
                        <div className="userDashboardZoneStat">
                        <span>Total reports</span>
                        <b>{zoneStats.totalAllTime}</b>
                        </div>
                        <div className="userDashboardZoneStat">
                        <span>Reports (24h)</span>
                        <b>{zoneStats.reports24h}</b>
                        </div>
                        <div className="userDashboardZoneStat">
                        <span>Reports (7d)</span>
                        <b>{zoneStats.reports7d}</b>
                        </div>
                        <div className="userDashboardZoneStat">
                        <span>Avg severity (7d)</span>
                        <b>{zoneStats.avgSeverity7d}</b>
                        </div>
                        <div className="userDashboardZoneStat">
                        <span>High severity (≥7, 7d)</span>
                        <b>{zoneStats.highSeverity7d}</b>
                        </div>
                        <div className="userDashboardZoneStat">
                        <span>Peak hour</span>
                        <b>{zoneStats.peakHour}</b>
                        </div>

                        <div className="userDashboardZoneTypes">
                        <div className="userDashboardZoneTypesTitle">Top noise types</div>

                        {zoneStats.topTypes.length === 0 ? (
                            <p className="userDashboardEmptyText">No data for this zone yet.</p>
                        ) : (
                            <ul className="userDashboardZoneTypesList">
                            {zoneStats.topTypes.map((t) => (
                                <li key={t.name} className="userDashboardZoneTypesItem">
                                <span>{t.name}</span>
                                <b>{t.count}</b>
                                </li>
                            ))}
                            </ul>
                        )}
                        </div>
                    </div>
                    )}
                </div>
            </div>

        </div>

        
    );
}

export default UserDashboard;
