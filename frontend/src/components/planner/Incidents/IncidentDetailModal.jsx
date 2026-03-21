import ReactModal from 'react-modal';
import { useState, useEffect } from 'react';
import StatusBadge from '../../common/StatusBadge';
import SeverityBadge from '../../common/SeverityBadge';
import Tag from '../../common/Tag';
import './IncidentDetailModal.css';
import { incidentServerService } from '../../services/incidentService'; 

const IncidentDetailModal = ({ isOpen, onClose, incident, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [processingNotes, setProcessingNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (incident?.status) {
      setSelectedStatus(incident.status);
    }
  }, [incident]); 

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '1200px',
      maxHeight: '90vh',
      borderRadius: '16px',
      padding: '0',
      border: 'none',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000
    }
  };

  const handleStatusUpdate = async () => {
    if (!incident) return;
    
    if (!selectedStatus) {
      alert('Please select a status');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      if (onUpdateStatus) {
        onUpdateStatus(incident.id, selectedStatus, processingNotes);
      }
      
      onClose();
    } catch (error) {
      console.error('Error occurred. Failed to update incident:', error);
      alert(`Failed to update: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityDescription = (severity) => {
    const level = parseInt(severity);
    if (level >= 8) return 'Critical - Immediate action required';
    if (level >= 6) return 'High - Urgent attention needed';
    if (level >= 4) return 'Moderate - Standard response';
    return 'Low - Minor disturbance';
  };

  const getSeverityColor = (severity) => {
    const level = parseInt(severity);
    if (level >= 8) return '#ef4444';
    if (level >= 6) return '#f97316';
    if (level >= 4) return '#eab308';
    return '#10b981';
  };

  const getSeverityLabel = (severity) => {
    const level = parseInt(severity);
    if (level >= 8) return 'Critical';
    if (level >= 6) return 'High';
    if (level >= 4) return 'Medium';
    return 'Low';
  };

  const statusOptions = [
    { value: 'Pending', label: 'Pending', icon: '⏳', color: 'yellow', description: 'Needs further review' },
    { value: 'Accepted', label: 'Accepted', icon: '✓', color: 'green', description: 'Accept as genuine' },
    { value: 'Rejected', label: 'Rejected', icon: '✗', color: 'red', description: 'False or inaccurate report' }
  ];

  if (!incident) return null;

  const getZoneColor = () => {
    switch(incident.zone) {
      case 'zone_a': return 'zone-red';
      case 'zone_b': return 'zone-blue';
      case 'zone_c': return 'zone-green';
      default: return 'zone-purple';
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      preventScroll={true}
    >
      <div className="modal-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
            </div>
            <div>
              <h2>Process Incident</h2>
              <p>Review details and update status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      <div className="modal-content">
        <div className="info-grid">
          <div className="info-column">
            <div className="info-section">
              <h3>Zone & Location</h3>
              <div className="zone-card">
                <div className={`zone-badge ${getZoneColor()}`}>
                  <span>{incident.zone?.charAt(incident.zone.length - 1).toUpperCase()}</span>
                </div>
                <div>
                  <div className="zone-name">{incident.zone?.replace('_', ' ').toUpperCase()}</div>
                  <div className="zone-type">Residential Area</div>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Reported Time</h3>
              <div className="time-card">
                <div className="time-display">{formatDate(incident.timestamp)}</div>
                <div className="time-ago">
                  {incident.timestamp ? 
                    `${Math.round((new Date() - new Date(incident.timestamp)) / 3600000)} hours ago` : 
                    'Time not available'}
                </div>
              </div>
            </div>
          </div>

          <div className="info-column">
            <div className="info-section">
              <h3>Current Status</h3>
              <div className="status-card">
                <div className="status-header">
                  <StatusBadge status={incident.status} />
                  <span className="incident-id">ID: {incident.id}</span>
                </div>
                <div className="status-description">
                  {incident.status === 'Pending' && 'Awaiting review'}
                  {incident.status === 'Accepted' && 'Verified and accepted'}
                  {incident.status === 'Rejected' && 'Rejected as invalid'}
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Noise Severity (1-10 scale)</h3>
              <div className="severity-card">
                <div className="custom-severity-display">
                  <div 
                    className="severity-indicator"
                    style={{ 
                      backgroundColor: getSeverityColor(incident.severity),
                      width: `${(parseInt(incident.severity) / 10) * 100}%`
                    }}
                  >
                    <span className="severity-value">{incident.severity}/10</span>
                  </div>
                </div>
                <div className="severity-details">
                  <span className="severity-label">
                    {getSeverityLabel(incident.severity)} Level
                  </span>
                  <span className="severity-description">
                    {getSeverityDescription(incident.severity)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="info-column">
            <div className="info-section">
              <h3>Category</h3>
              <div className="category-card">
                <Tag label={incident.category} />
                <div className="category-description">
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Tags & Keywords</h3>
              <div className="tags-card">
                <div className="tags-container">
                  {incident.tags?.map((tag, index) => (
                    <Tag key={index} label={tag} color="grey" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="description-section">
          <h3>Full Description</h3>
          <div className="description-card">
            <p>{incident.description || 'No description provided'}</p>
          </div>
        </div>

        <div className="processing-section">
          <h3>Process This Incident</h3>
          
          <div className="status-selection">
            <h4>Update Status</h4>
            <div className="status-options">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`status-option-btn ${selectedStatus === option.value ? 'selected' : ''}`}
                  style={{
                    backgroundColor: selectedStatus === option.value ? `${option.color === 'yellow' ? '#fef3c7' : option.color === 'green' ? '#d1fae5' : '#fee2e2'}` : '#f9fafb',
                    border: selectedStatus === option.value ? `2px solid ${option.color === 'yellow' ? '#eab308' : option.color === 'green' ? '#22c55e' : '#ef4444'}` : '1px solid #e5e7eb',
                    transform: selectedStatus === option.value ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: selectedStatus === option.value ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                  disabled={isUpdating}
                >            
                  <div className="status-icon" style={{
                    backgroundColor: selectedStatus === option.value ? 'white' : 'transparent',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>{option.icon}</div>
                  <div className="status-label" style={{
                    fontWeight: selectedStatus === option.value ? '600' : '400'
                  }}>{option.label}</div>
                  <div className="status-desc">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <button
              onClick={onClose}
              className="cancel-button"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              className="save-button"
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Status & Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <div className="footer-content">
          <div className="footer-left">
            Last updated {incident.updated_at ? 
              formatDate(incident.updated_at) : 
              'Not available'}
          </div>
          <div className="footer-right">
            Priority: <span style={{ color: getSeverityColor(incident.severity) }}>
              {getSeverityLabel(incident.severity)}
            </span>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

export default IncidentDetailModal;