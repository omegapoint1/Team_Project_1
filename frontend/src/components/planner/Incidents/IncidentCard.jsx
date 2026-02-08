import StatusBadge from '../../common/StatusBadge';
import SeverityBadge from '../../common/SeverityBadge';
import Tag from '../../common/Tag';
import './IncidentCard.css';

const IncidentCard = ({ incident, onViewMore }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getZoneClass = () => {
    switch(incident.zone) {
      case 'zone_a': return 'zone-red';
      case 'zone_b': return 'zone-blue';
      case 'zone_c': return 'zone-green';
      default: return 'zone-purple';
    }
  };

  return (
    <div className="incident-card">
      <div className="card-header">
        <div className="zone-info">
          <div className={`zone-badge ${getZoneClass()}`}>
            <span>{incident.zone.charAt(incident.zone.length - 1).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="zone-name">
              {incident.zone.replace('_', ' ').toUpperCase()}
            </h3>
            <p className="zone-time">
              {formatDate(incident.timestamp)}
            </p>
          </div>
        </div>
        <div className="status-badges">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
        </div>
      </div>

      <p className="card-description">
        {truncateText(incident.description)}
      </p>

      <div className="card-tags">
        <Tag 
          label={incident.category} 
          color={
            incident.category === 'construction' ? 'yellow' :
            incident.category === 'music' ? 'purple' :
            incident.category === 'traffic' ? 'blue' :
            incident.category === 'events' ? 'green' : 'gray'
          }
        />
        
        {incident.description.toLowerCase().includes('drilling') && (
          <Tag label="Drilling" color="red" />
        )}
        {incident.description.toLowerCase().includes('night') && (
          <Tag label="Night Time" color="purple" />
        )}
        {incident.description.toLowerCase().includes('weekend') && (
          <Tag label="Weekend" color="green" />
        )}
        {incident.severity === 'high' && (
          <Tag label="Urgent" color="red" />
        )}
        
        {incident.tags?.map((tag, index) => (
          <Tag key={index} label={tag} color="gray" />
        ))}
      </div>

      <div className="card-footer">
        <span className="incident-id">
          ID: {incident.id}
        </span>
        <button
          onClick={() => onViewMore(incident)}
          className="view-button"
        >
          <span>View & Process</span>
          <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default IncidentCard;