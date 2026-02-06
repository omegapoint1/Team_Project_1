import React from "react";
import "./GamePage.css";
import { Link } from "react-router-dom";

export default function GamePage() {
    const quests = Array.from({length:6}).map(() => ({
        status:"Status",
        difficulty:"Difficulty",
        xp:"XP",
        name:"Quest Name",
        description:"brief description of quest"
    }));

    return (
        <div className="game-page">
            <div className="search-full-bar">
                <input
                    className="search-full-input"
                    placeholder="Search"
                />
            </div>
            <div className="filter-controls">
                <button className="quests-btn">Filter ▼</button>
                <button className="quests-btn">Difficulty ▼</button>
                <button className="quests-btn">Sort ▼</button>
                <button className="quests-btn game-apply">Apply</button>
            </div>
            {/* Section Title */}
            <div className="game-title">Quests</div>
            {/*Quest List*/}
            <div className="game-list">
                {quests.map((q,i) =>(
                    <div key={i} className="game-card">
                        <div className="game-meta">
                            {q.status}<br />
                            {q.difficulty}< br/>
                            {q.xp}
                        </div>
                        <div className="game-main">
                            <h3>{q.name}</h3>
                            <p>{q.description}</p>
                        </div>
                        <button className= "game-accept">
                            Accept<br /> Quest
                        </button>
                    </div>    
                ))}
            </div>
            {/* Load More */}
            <button className="game-load-more">Loadmore</button>
        </div>
    );
}