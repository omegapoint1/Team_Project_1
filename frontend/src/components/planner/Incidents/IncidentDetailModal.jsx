import ReactModal from 'react-modal';
import { useState } from 'react';
import StatusBadge from '../../common/StatusBadge';
import SeverityBadge from '../../common/SeverityBadge';
import Tag from '../../common/Tag';
import './IncidentDetailModal.css';
import { incidentServerService } from '../../services/incidentService'; 

/*
Code for Modal that appears when the incident card 'View more' is pressed. 
Calls reactModal library for modal component and displays incident information
*/



const IncidentDetailModal = ({ isOpen, onClose, incident, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(incident?.status || 'pending');
  const [processingNotes, setProcessingNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

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
    
    setIsUpdating(true);
    
    try {
      const statusToUpdate = selectedStatus.toLowerCase();
      
      const updatedIncident = await incidentServerService.update(incident.id, {
        status: statusToUpdate,
        processingNotes: processingNotes 
      });
      
      onUpdateStatus(incident.id, statusToUpdate, processingNotes, updatedIncident);
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


  // Helper function to get severity color
  const getSeverityColor = (severity) => {
    const level = parseInt(severity);
    if (level >= 7) return '#ef4444'; // red
    if (level >= 5) return '#f97316'; // orange
    if (level >= 3) return '#eab308'; // yellow
    return '#10b981'; // green
  };

  // Helper function to get severity label
  const getSeverityLabel = (severity) => {
    const level = parseInt(severity);
    if (level >= 7) return 'Critical';
    if (level >= 5) return 'High';
    if (level >= 3) return 'Medium';
    return 'Low';
  };

  const statusOptions = [
    { value: 'Pending', label: 'Mark as Pending', icon: '⏳', color: 'yellow', description: 'Needs review' },
    { value: 'Accepted', label: 'Validated Incident', icon: '✓', color: 'green', description: 'Accept as genuine/accurate report' },
    { value: 'Rejected', label: 'Reject as Invalid', icon: '✗', color: 'red', description: 'False or inaccurate report' },
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

  const getCategoryColor = () => {
    switch(incident.category) {
      case 'construction': return 'yellow';
      case 'music': return 'purple';
      case 'traffic': return 'blue';
      case 'events': return 'green';
      default: return 'gray';
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      ariaHideApp={false}
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
                  <StatusBadge status={selectedStatus} />
                  <span className="incident-id">ID: {incident.id}</span>
                </div>
                <div className="status-description">
                  {incident.status.toLowerCase() === 'pending' && 'Awaiting review'}
                  {incident.status.toLowerCase() === 'accepted' && 'Verified and accepted'}
                  {incident.status.toLowerCase() === 'rejected' && 'Rejected as invalid'}
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
                      width: `${(parseInt(incident.severity) / 8) * 100}%`
                    }}
                  >
                    <span className="severity-value">{incident.severity}/8</span>
                  </div>
                </div>
                <div className="severity-details">
                  <span className="severity-label">
                    {getSeverityLabel(incident.severity)} Level
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="info-column">
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
                  style={{
                    backgroundColor: selectedStatus.toLowerCase === option.value.toLowerCase() ? `${option.color}20` : 'white'
                  }}
                  disabled={isUpdating}
                >
                  <div className="status-label">{option.label}</div>
                  <div className="status-desc">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="notes-section">
            <h4>Add Processing Notes (Optional)</h4>
            <textarea
              value={processingNotes}
              onChange={(e) => setProcessingNotes(e.target.value)}
              placeholder="Add any notes about why you're changing the status, additional context, or follow-up actions needed..."
              className="notes-textarea"
              rows={4}
              disabled={isUpdating}
            />
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