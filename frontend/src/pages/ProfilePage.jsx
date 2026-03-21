import { useEffect, useMemo, useState } from 'react';
import './ProfilePage.css';

const rankImages = {
  Bronze: '/static/bronze.png',
  Silver: '/static/silver.png',
  Gold: '/static/Gold.webp',
  Platinum: '/static/Platinum.webp',
  Diamond: '/static/Diamond.png',
  Champion: '/static/Champion.png',
  Master: '/static/Master.webp',
  Grandmaster: '/static/GM.png',
};

function ProfilePage() {
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const userId = storedUser.id ?? storedUser.user_id ?? null;

  const [user, setUser] = useState(storedUser);
  const [progression, setProgression] = useState({
    total_xp: storedUser.total_xp ?? 0,
    level: storedUser.level ?? 1,
    completed_quests: storedUser.completed_quests ?? 0,
  });
  const [loadingProgression, setLoadingProgression] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const getRankFromXP = (xp) => {
    if (xp >= 5000) return 'Champion';
    if (xp >= 4000) return 'Master';
    if (xp >= 3000) return 'Diamond';
    if (xp >= 2000) return 'Platinum';
    if (xp >= 1000) return 'Gold';
    if (xp >= 500) return 'Silver';
    return 'Bronze';
  };

  const fetchProgression = async (showLoader = false) => {
  if (!userId) {
    setLoadingProgression(false);
    return;
  }

  if (showLoader) {
    setLoadingProgression(true);
  }

  try {
    const response = await fetch(`/api/user/progression/${userId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to load progression');
    }

    const nextProgression = {
      total_xp: data.total_xp ?? 0,
      level: data.level ?? 1,
      completed_quests: data.completed_quests ?? 0,
    };

    setProgression(nextProgression);

    const updatedUser = {
      ...user,
      ...nextProgression,
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  } catch (error) {
    console.error('Error loading progression:', error);
  } finally {
    if (showLoader) {
      setLoadingProgression(false);
    }
  }
};

  useEffect(() => {
    fetchProgression(true);

    const intervalId = setInterval(() => {
      fetchProgression(false);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [userId]);

  const totalXp = progression.total_xp ?? 0;
  const level = progression.level ?? 1;
  const completedQuests = progression.completed_quests ?? 0;

  const progressPercent = useMemo(() => {
    const xpIntoCurrentLevel = totalXp % 1000;
    return Math.floor((xpIntoCurrentLevel / 1000) * 100);
  }, [totalXp]);

  const rank = getRankFromXP(totalXp);
  const displayName = user.username || user.email || 'User';
  const displayRole = user.role === 'planner' ? 'Planner' : 'User';

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userLogout'));
    window.location.href = '/login';
  };

  const openDeleteModal = () => {
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteError('');
    setShowDeleteModal(false);
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    setIsDeleting(true);

    try {
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setDeleteError(data.message || 'Failed to delete account.');
        setIsDeleting(false);
        return;
      }

      localStorage.removeItem('user');
      window.dispatchEvent(new Event('userLogout'));
      window.location.href = '/signup';
    } catch (error) {
      console.error('Delete account error:', error);
      setDeleteError('Error deleting account. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-card-top">
          <div className="rank-panel">
            <img
              src={rankImages[rank] || rankImages.Bronze}
              alt={rank}
              className="rank-image"
            />
            <p className="rank-title">{rank}</p>

            <div className="progress-bar-wrap">
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  data-testid="xp-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                />
                <span className="progress-bar-text">{progressPercent}%</span>
              </div>
            </div>
          </div>

          <div className="profile-main-info">
            <div className="profile-heading">
              <h1 className="profile-username">{displayName}</h1>

              <div className="profile-badges">
                <span className="role-badge">{displayRole}</span>
                <span className="level-badge">
                  {loadingProgression ? 'Loading...' : `Level ${level}`}
                </span>
              </div>
            </div>

            <div className="profile-info-grid">
              <div className="info-box">
                <span className="info-label">Username</span>
                <span className="info-value">{displayName}</span>
              </div>

              <div className="info-box">
                <span className="info-label">User Type</span>
                <span className="info-value">{displayRole}</span>
              </div>

              <div className="info-box">
                <span className="info-label">Current Rank</span>
                <span className="info-value">{rank}</span>
              </div>

              <div className="info-box">
                <span className="info-label">Completed Quests</span>
                <span className="info-value">{completedQuests}</span>
              </div>
            </div>

            <div className="xp-highlight-card">
              <div className="xp-highlight-label">Experience Points</div>
              <div className="xp-highlight-value" data-testid="xp-value">
                {loadingProgression ? '...' : totalXp}
              </div>
              <div className="xp-highlight-subtext">
                {loadingProgression
                  ? 'Loading your progression...'
                  : `You are currently level ${level}. Keep contributing to level up your rank.`}
              </div>
            </div>
          </div>

          <div className="profile-actions-wrap">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>

            <button className="delete-account-button" onClick={openDeleteModal}>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Account?</h2>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>

            {deleteError && <div className="delete-error">{deleteError}</div>}

            <div className="delete-modal-buttons">
              <button
                className="cancel-delete-button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                className="confirm-delete-button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;