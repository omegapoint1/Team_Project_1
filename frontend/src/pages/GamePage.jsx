import React from "react";
import "./GamePage.css";
export default function Quests() {
    const quests = Array.from({length:6}).map(() => ({
        status:"Status",
        difficulty:"Difficulty",
        xp:"XP",
        name:"Quest Name",
        description:"brief description of quest"
    }));
    return (
        <div className="quest-page">
            {/* Top Bar */}
            <div className="quest-topbar">
                <div className="quest-logo'">📣 Neighborhood Noise </div>
                <div className="quest-nav">
                    <span>Dashboard</span>
                    <span><strong>Quests</strong></span>
                    <span>Report</span>
                </div>
            </div>
            {/*Controls*/}
            <div className="quests-control">
                <input
                    className="quests-search"
                    placeholder = "Search"

                />
                <button className="quests-brn">Filter ▼</button>
                <button className="quests-brn">Difficulty ▼</button>
                <button className="quests-brn">Sort ▼</button>
                <button className="quests-brn quests-apply">Apply</button>
            </div>
            {/* Section Title */}
            <div className="quests-title">Quests</div>
            {/*Quest List*/}
            <div className="quests-list">
                {quests.map((q,i) =>(
                    <div key={i} className="quest-card">
                        <div className="quest-meta">
                            {q.status}<br />
                            {q.difficulty}< br/>
                            {q.xp}
                        </div>
                        <div className="quest-main">
                            <h3>{q.name}</h3>
                            <p>{q.description}</p>
                        </div>
                        <button className= "quest-accept">
                            Accept<br /> Quest
                        </button>
                    </div>    
                ))}
            </div>
            {/* Load More */}
            <button className="quests-load-more">Loadmore</button>
        </div>
    );
}