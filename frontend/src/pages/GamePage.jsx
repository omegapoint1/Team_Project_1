import React from "react";
import "./GamePage.css";
import { Link } from "react-router-dom";

export default function GamePage() {
    const [showBadges, setShowBadges] = useState(false);
    const [userXP, setUserXP] = useState(750);
    const maxXP = 1000;
    const userLevel = 5;
    const quests = Array.from({length:6}).map(() => ({
        status:"Status",
        difficulty:"Difficulty",
        xp:"XP",
        name:"Quest Name",
        description:"brief description of quest"
    }));
    const badges = [
        { id: 1, name: "First Quest", earned: true, icon: "🏆", description: "Complete your first quest"},
        { id: 2, name: "Quest Master", earned: false, icon: "👑", description: "Complete 10 quests"},
        { id: 3, name: "Collector", earned: false, icon: "📦", description: "Earn 5 different badges"},
        { id: 4, name: "Veteran", earned: false, icon: "⭐", description: "Reach level 10"},
        { id: 5, name: "", earned: false, icon: "", description: ""},
    ];
    const xpPercentage = (userXP / maxXP) * 100;

    return (
        <div className="game-page">
            <div className="user-progress">
                <div className="level-info">
                    <span className="level-badge"> Level {userLevel}</span>
                    <span className="xp-test"> {userXP}/{maxXP}</span>
                </div>
                <div className="xp-bar-container">
                    <div
                        className="xp-bar-container"
                        style={{width: '${xpPercentage}%'}}
                    ></div>
                </div>
            </div>
            <div className="game-controls-full">
                <div className="search-section">
                    <input
                        className="search-full-input"
                        placeholder="Search"
                    />
                </div>
                <div className="filter-section">
                    <button className="game-btn">Filter ▼</button>
                    <button className="game-btn">Difficulty ▼</button>
                    <button className="game-btn">Sort ▼</button>
                </div>
                <div className="apply-section">
                    <button className="game-btn game-apply">Apply</button>
                </div>
            </div>
            {/* Section Title */}
            <div className="section-header">
                <div className="game-title">Quests</div>  
                <button
                    className={`badge-toggle-btn ${showBadges ? 'active': ''}`}
                    onClick = {() => setShowBadges(!showBadges)}
                >
                    {showBadges ? '▼ Hide Badges' : '► Show Badges'}
                </button>
            </div>
            {/* badges Section */}
            {showBadges && (
                <div className="badges-section">
                    <h3 className="badges-title">Earned Badges</h3>
                    <div className="badges-grid">
                        {badges.map(badge => (
                            <div
                                key={badge.id}
                                className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}
                                title={badge.description}
                            >
                                <div className="badge-icon">{badge.icon}</div>
                                <div className="badge-name">{badge.name}</div>
                                {!badge.earned && <div className="badge-lock">🔒</div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/*Quest List*/}
            <div className="game-list">
                {quests.map((q,i) =>(
                    <div key={i} className="game-card">
                        <div className="game-meta">
                            <span className="status-badge">{q.status}</span>
                            <br />
                            <span className="difficulty-badge">{q.difficulty}</span>
                            <br />
                            <span className="xp-badge">{q.xp}</span>
                        </div>
                        <div className="game-main">
                            <h3>{q.name}</h3>
                            <p>{q.description}</p>
                        </div>
                        <button className= "game-accept">
                            Accept <br /> Quest
                        </button>
                    </div>    
                ))}
            </div>
            {/* Load More */}
            <button className="game-load-more">Loadmore</button>
        </div>
    );
}