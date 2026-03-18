import { useState } from 'react';
import './ProfilePage.css';

const rankImages = {
  Bronze: '/bronze.png',
  Silver: '/silver.png',
  Gold: '/Gold.webp',
  Platinum: '/Platinum.webp',
  Diamond: '/Diamond.png',
  Champion: '/Champion.png',
  Master: '/Master.webp',
  Grandmaster: '/GM.png',
};

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('user')) || {};

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

  const getProgressPercent = (progressValue) => {
    if (typeof progressValue === 'number') {
      return Math.max(0, Math.min(100, progressValue));
    }

    if (typeof progressValue === 'string') {
      const parsed = parseInt(progressValue.replace('%', '').trim(), 10);
      if (!Number.isNaN(parsed)) {
        return Math.max(0, Math.min(100, parsed));
      }
    }

    return 0;
  };

  const rank = user.rank || getRankFromXP(user.xp || 0);
  const progressPercent = getProgressPercent(user.progress);
  const xp = user.xp ?? 0;
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
                <span className="xp-badge">{xp} XP</span>
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
                <span className="info-label">Progress</span>
                <span className="info-value">{progressPercent}%</span>
              </div>
            </div>

            <div className="xp-highlight-card">
              <div className="xp-highlight-label">Experience Points</div>
              <div className="xp-highlight-value">{xp}</div>
              <div className="xp-highlight-subtext">
                Keep contributing to level up your rank.
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
          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
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