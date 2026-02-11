import React, { useState } from "react";
import MapBackground from "../components/MapBackground";
import "./UserDashboard.css";

function UserDashboard() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [timeRange, setTimeRange] = useState("24h");

    const handleSearch = () => {
        console.log("Searching for:", search);
};

    return (
        <div className="userDashboardPage">
        {/* Filter bar (same idea as Dashboard_Overview, but namespaced classes) */}
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
                <div className="userDashboardPanelTitle">Overview</div>
                    <p className="userDashboardEmptyText">No items to show yet.</p>
                </div>
            </div>
        </div>

      {/* Bottom 4 cards (empty states for now) */}
        <div className="userDashboardCardsRow">
            <div className="userDashboardInfoCard">
                <div className="userDashboardCardTitle">Key Statistics</div>
                <p className="userDashboardEmptyText">Not available yet.</p>
            </div>

        <div className="userDashboardInfoCard">
            <div className="userDashboardCardTitle">Top Hotspots</div>
                <p className="userDashboardEmptyText">Not available yet.</p>
            </div>

        <div className="userDashboardInfoCard">
            <div className="userDashboardCardTitle">Common Tags</div>
                <p className="userDashboardEmptyText">Not available yet.</p>
            </div>

        <div className="userDashboardInfoCard">
            <div className="userDashboardCardTitle">Updates</div>
                <p className="userDashboardEmptyText">Nothing to show yet.</p>
            </div>
        </div>
    </div>
    );
}

export default UserDashboard;
