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
            {/* Top Bar */}
            <div className="navbar">
                <div className="navbar-left'">
                    <Link to="/dashboard">
                        <img src="/logo.png" alt="Website Logo" className="websiteLogo"/>
                    </Link>
                    <span className="nav-title">Neighbourhood Noise</span>
                </div>        
                <div className="navbar-right">
                    <Link to="/dashboard" className="nav-link">
                        Dashboard
                    </Link>
                    <Link to="/planner" className="nav-link">
                        Planner
                    </Link>
                    <Link to="/" className="nav-link-icon">
                        <span className="nav-user-icon">👤</span>
                    </Link>
                </div>
            </div>

            {/*Controls*/}
            <div className="game-control">
                <input
                    className="game-search"
                    placeholder = "Search"
                />
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