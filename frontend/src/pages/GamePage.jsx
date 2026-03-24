import React, { useState, useEffect } from "react";
import "./GamePage.css";
import { Link, useNavigate } from "react-router-dom";

export default function GamePage() {
    const navigate = useNavigate(); //navigation hook for redirection
    const [showBadges, setShowBadges] = useState(false); 
    const [userXP, setUserXP] = useState(0); //Progression data
    const [maxXP, setMaxXP] = useState(1000);
    const [userLevel, setUserLevel] = useState(1);
    const [quests,setQuests] = useState([]);
    const [ userQuests, setUserQuests ] = useState([]); //available quests
    const [progression, setProgression] = useState(null); //users quest progress
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // search/filter states
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");
    const [sortBy, setSortBy] = useState("default");
    const [questProgressState, setQuestProgressState] = useState({});
    const user = JSON.parse(localStorage.getItem('user') || '{}'); //user ID 
    const userId = user.id;
    //redirect to login if not logged in
    if (!userId) { 
        window.location.href = '/login';
        return null;
    }
    //checks for quest progress when page is visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                console.log('Page became visible - checking quest progress');
                checkQuestProgressFromSession();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        checkQuestProgressFromSession();
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
    //reads quest progress from session storage
    const checkQuestProgressFromSession = () => {
        const savedProgress = sessionStorage.getItem('questProgress');
        console.log('checkQuestProgressFromSession - savedProgress:', savedProgress);
        if(savedProgress) {
            const progress = JSON.parse(savedProgress);
            setQuestProgressState(prev => ({ ...prev, ...progress}));
            sessionStorage.removeItem('questProgress');
        }
    };
    //gets quests from back end
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
    //gets users started quests
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
    //gets users progression... XP and level
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
    //starts quests
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
    //calculates XP for current level
    const getCurrentLevelXP = (totalXP, level) => {
        const previousLevelXP = (level - 1) * 1000;
        return totalXP - previousLevelXP;
    };
    //checks if quests can be completed
    const canCompleteQuest = (quest) => {
        if (quest.id === 1) {
            return questProgressState[`quest_${quest.id}`] === true;
            console.log(`Quest ${quest.id} - isUnlocked:`, isUnlocked, 'questProgressState:', questProgressState);
            return isunlocked;
        }
        return false;
    };

    const canStartQuest = (quest) => {
        return true;
    };

    const handleQuestAction = (quest, isInProgress) => {
        console.log('handleQuestAction - quest:', quest.id, 'isInProgress:', isInProgress, 'canComplete:', canCompleteQuest(quest));
        if(isInProgress) {
            if (canCompleteQuest(quest)){
                console.log('requirements met - Completing the quest');
                completeQuest(quest.id);
            } else {
                if(quest.id === 1) {
                    console.log('Requirements not met - redirecting to dashboard');
                    sessionStorage.setItem('pendingQuestComplete', quest.id);
                    navigate('/user-dashboard');
                } 
            }
        } else {
            console.log('starting quest');
            startQuest(quest.id);
        }
    };
    //quest completion and awards XP
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
    //XP progress calculations
    const currentLevelXP = getCurrentLevelXP(userXP, userLevel);
    const xpPercentage = (currentLevelXP / 1000) * 100;
    const filteredQuests = quests.filter(quest => { //quest filter and search
        const matchesSearch = searchTerm === "" ||
            quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quest.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = selectedDifficulty === "all" ||
            quest.difficulty === selectedDifficulty;
        return matchesSearch && matchesDifficulty;
    });
    //quest sorter
    const sortedQuests = [...filteredQuests].sort((a,b) => {
        switch(sortBy) {
            case "xp_asc":
                return a.xp_reward - b.xp_reward;
            case "xp_desc":
                return b.xp_reward - a.xp_reward;
            case "name_asc":
                return a.title.localeCompare(b.title);
            case "name_desc":
                return b.title.localeCompare(a.title);
            case "difficulty":
                const difficultyOrder = { "easy": 1, "medium": 2, "hard": 3 };
                return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
            default:
                return 0;
        }
    });
    //loading and error states
    if (loading) return <div className="game-page">Loading Quests...</div>
    if (error) return <div className="game-page">Error: {error}</div>;

    return (
        <div className="game-page">
            <div className="user-progress">
                {/*XP progress bar */}
                <div className="level-info">
                    <span className="level-badge"> Level {userLevel}</span>
                    <span className="xp-test"> {currentLevelXP}/1000 XP</span>
                </div>
                <div className="xp-bar-container">
                    <div
                        className="xp-bar-fill"
                        style={{width: `${xpPercentage}%`}}
                    ></div>
                </div>
            </div>
            {/* search and filter controls */}
            <div className="game-controls-full">
                <div className="search-section">
                    <input
                        className="search-full-input"
                        placeholder="Search quests by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-section">
                    <select
                        className="game-btn"
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                    >
                        <option value="all">All difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <select
                        className="game-btn"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="default">Sort By...</option>
                        <option value="xp_asc">XP: Low to high</option>
                        <option value="xp_desc">XP: High to low</option>
                        <option value="name_asc">Name: A to Z</option>
                        <option value="name_desc">Name Z to A</option>
                        <option value="difficulty">Difficulty (easy to hard)</option>

                    </select>
                </div>
                <div className="apply-section">
                    <button 
                        className="game-btn game-apply"
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedDifficulty("all");
                            setSortBy("default");
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
            {/* quest Section Title */}
            <div className="section-header">
                <div className="game-title">
                    Quests
                    {filteredQuests.length !== quests.length && (
                        <span className="results-count"> ({filteredQuests.length} of {quests.length})</span>
                    )}
                </div>  
            </div>
            {/*Quest List*/}
            <div className="game-list">
                {sortedQuests.length === 0 ? (
                    <div className="no-results">
                        <p>No Quests match your current search.</p>
                        <button
                            className="game-btn"
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedDifficulty("all");
                                setSortBy("default");
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    sortedQuests.map((quest) => {
                    const userQuest = userQuests.find(uq => uq.quest_id === quest.id);
                    const isInProgress = userQuest && userQuest.status === 'in_progress';
                    const isCompleted = userQuest && userQuest.status === 'completed';
                    const requirementsMet = canCompleteQuest(quest);
                    const canBeCompleted = canCompleteQuest(quest);
                    return (
                        <div key={quest.id} className="game-card">
                            <div className="game-meta">
                            <span className="difficulty-badge">{quest.difficulty}</span>
                            <span className="xp-badge">{quest.xp_reward} XP</span>
                            </div>
                            <div className="game-main">
                                <h3>{quest.title}</h3>
                                <p>{quest.description}</p>
                            </div>
                            <button 
                                className= "game-accept"
                                onClick={() => handleQuestAction (quest, isInProgress)}
                                disabled ={isCompleted || (isInProgress && !requirementsMet)}
                                >
                                    { isCompleted ? 'Completed' :
                                    (isInProgress ? (requirementsMet ? 'Complete' : 'Complete (Locked)') : 'Accept Quest')}                                
                            </button>
                        </div>
                    );
                })
                )}
            </div>    
        </div>
    );
}