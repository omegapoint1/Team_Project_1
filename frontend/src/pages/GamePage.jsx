import React, { useState, useEffect } from "react";
import "./GamePage.css";
import { Link } from "react-router-dom";

export default function GamePage() {
    const [showBadges, setShowBadges] = useState(false);
    const [userXP, setUserXP] = useState(0);
    const [maxXP, setMaxXP] = useState(1000);
    const [userLevel, setUserLevel] = useState(1);
    const [quests,setQuests] = useState([]);
    const [ userQuests, setUserQuests ] = useState({});
    const [progression, setProgression] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = '/login';
        return null;
    }
    const fetchQuests = async () =>{
        try {
            const response = await fetch('/api/quests');
            if (!response.ok) throw new Error('Failed to fetch quests');
            const data = await response.json();
            setQuests(data);
        } catch (err) {
            setError(err.message);
        }
    };
    const fetchUserQuests = async () => {
        try {
            const response = await fetch(`/api/user/quests/${userId}`);
            if (!response.ok) throw new Error(`failed to fetch use quests`);
            const data = await response.json();
            setUserQuests(data);
        } catch(err) {
            setError(err.message);
        }
    };
    const fetchUserProgression = async () => {
        try {
            const response = await fetch(`/api/user/progression/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch progression');
            const data = await response.json();
            setUserXP(data.total_xp);
            setUserLevel(data.level);
            setProgression(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const startQuest = async (questId) => {
        try {
            const response = await fetch('/api/quests/start', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    user_id: parseInt(userId),
                    quest_id: questId
                })
            });
            if (!response.ok) throw new Error('failed to start quest');
            await fetchUserQuests();
        } catch (err) {
            setError(err.message);
        }
    };
    const completeQuest = async(questId) => {
        try{
            const response = await fetch('/api/quests/complete', {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: parseInt(userId),
                    quest_id:questId
                })
            });
            if (!response.ok) throw new Error('failed to complete quest');
            const data = await response.json();
            if (data.progression) {
                setUserXP(data.progression.total_xp);
                setUserLevel(data.progression.level);
                setProgression(data.progression);
            }
            await fetchUserQuests();
            await fetchQuests();
        }  catch (err) {
            setError(err.message);
        }
    };

    useEffect(() =>{
        const loadData = async () => {
            setLoading(true);
            try{
                await Promise.all([
                    fetchQuests(),
                    fetchUserQuests(),
                    fetchUserProgression()
                ]);
            }catch (err){
                setError(err.message);
            } finally{
                setLoading(false);
            }
        };
        loadData();
    }, []);
    const xpPercentage = maxXP > 0 ? (userXP/maxXP) * 100 : 0;

    if (loading) return <div className="game-page">Loading Quests...</div>
    if (error) return <div className="game-page">Error: {error}</div>;

    return (
        <div className="game-page">
            <div className="user-progress">
                <div className="level-info">
                    <span className="level-badge"> Level {userLevel}</span>
                    <span className="xp-test"> {userXP}/{maxXP}</span>
                </div>
                <div className="xp-bar-container">
                    <div
                        className="xp-bar-fill"
                        style={{width: `${xpPercentage}%`}}
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
            </div>
            {/*Quest List*/}
            <div className="game-list">
                {quests.map((quest, index)=> {
                    const userQuest = userQuests.find(uq => uq.quest_id === quest.id);
                    const isInProgress = userQuest && userQuest.status === 'in_progress';
                    const isCompleted = userQuest && userQuest.status === 'completed';
                    return (
                        <div key={index} className="game-card">
                            <div className="game-meta">
                            </div>
                            <div className="game-main">
                                <h3>{quest.title}</h3>
                                <p>{quest.description}</p>
                                {isInProgress && (
                                    <div className="quest-progress">
                                        Progress: {userQuest.progress}/{userQuest.max_Progress}
                                    </div>
                                )}
                            </div>
                            <button 
                                className= "game-accept"
                                onClick={() => {
                                    if (isCompleted) return;
                                    if (isInProgress) {
                                        completeQuest(quest.id);
                                    }else{
                                        startQuest(quest.id);
                                    }
                                }}
                                disabled={isCompleted}
                            >
                                {isCompleted ? 'Completed' : (isInProgress ? 'Complete' : 'Accept Quest')}
                            </button>
                        </div>
                    );
                })}
            </div>    
            {/* Load More */}
            <button className="game-load-more">Loadmore</button>
        </div>
    );
}