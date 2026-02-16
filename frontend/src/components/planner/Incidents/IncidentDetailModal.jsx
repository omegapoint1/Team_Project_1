import ReactModal from 'react-modal';
import { useState } from 'react';
import StatusBadge from '../../common/StatusBadge';
import SeverityBadge from '../../common/SeverityBadge';
import Tag from '../../common/Tag';
import './IncidentDetailModal.css';
import { incidentServerService } from '../../services/incidentService'; 



/*Modal for the expanded details of each incident card*/
const IncidentDetailModal = ({ isOpen, onClose, incident, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(incident?.status || 'pending');
  const [processingNotes, setProcessingNotes] = useState('');

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
  
  try {
    //Cal API to update the incident
    const updatedIncident = await incidentServerService.update(incident.id, {
      status: selectedStatus,
      processingNotes: processingNotes 
    });
    //call back updating current . MAybe combine
    onUpdateStatus(incident.id, selectedStatus, processingNotes, updatedIncident);
    
    onClose();
  } catch (error) {
    console.error('Error occured. Failed to update incident:', error);
    alert(`Failed to update: ${error.message}`);
  }

  }



  const formatDate = (dateString) => {
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

  const statusOptions = [
    { value: 'pending', label: 'Mark as Pending', icon: '⏳', color: 'yellow', description: 'Needs further review' },
    { value: 'Accpeted', label: 'Validated Incident', icon: '✓', color: 'green', description: 'Accept as genuine' },
    { value: 'Rejected', label: 'Reject as Invalid', icon: '✗', color: 'orange', description: 'False or inaccurate report' }
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
          >

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
                  <span>{incident.zone.charAt(incident.zone.length - 1).toUpperCase()}</span>
                </div>
                <div>
                  <div className="zone-name">{incident.zone.replace('_', ' ').toUpperCase()}</div>
                  <div className="zone-type">Residential Area</div>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Reported Time</h3>
              <div className="time-card">
                <div className="time-display">{formatDate(incident.timestamp)}</div>
                <div className="time-ago">2 hours ago</div>
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
                  {incident.status === 'pending' && 'Awaiting review'}
                  {incident.status === 'Accepted' && 'Verified and accepted'}
                  {incident.status === 'Rejected' && 'Rejected'}
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Noise Severity</h3>
              <div className="severity-card">
                <SeverityBadge severity={incident.severity} />
                <div className="severity-description">
                  {incident.severity === 'high' && 'Urgent attention required'}
                  {incident.severity === 'medium' && 'Moderate impact'}
                  {incident.severity === 'low' && 'Minor disturbance'}
                </div>
              </div>
            </div>
          </div>

          <div className="info-column">
            <div className="info-section">
              <h3>Category</h3>
              {/*<div className="category-card">
                <Tag label={incident.category} color={getCategoryColor()} />
                <div className="category-description">
                  {incident.category === 'construction' && 'Building or demolition work'}
                  {incident.category === 'music' && 'Entertainment or social noise'}
                  {incident.category === 'traffic' && 'Road or vehicle noise'}
                  {incident.category === 'events' && 'Organized event noise'}
                </div>
              </div>*/}
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
            <p>{incident.description}</p>
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
                  className={`status-option ${selectedStatus === option.value ? 'selected' : ''} ${option.color}`}
                >
                  <div className="status-icon">{option.icon}</div>
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
            />
          </div>

          <div className="action-buttons">
            <button
              onClick={onClose}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              className="save-button"
            >

              Update Status & Save
            </button>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <div className="footer-content">
          <div className="footer-left">
            Last updated 2 hours ago
          </div>
          <div className="footer-right">
            Priority: <span>Medium</span>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

export default IncidentDetailModal;