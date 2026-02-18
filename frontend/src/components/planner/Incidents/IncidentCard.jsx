import StatusBadge from '../../common/StatusBadge';
import SeverityBadge from '../../common/SeverityBadge';
import Tag from '../../common/Tag';
import './IncidentCard.css';

/*

The container displaying the incident reports information displayed in the scrollable grid container
Onclick calls the incident detail modal for processing.
uses the severity badge and status badge components which can later be simplified and integrated inside 


*/



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


  const getZoneClass = () => {
    const zoneName = incident.zone || '';
    //maybe remove 
    // Color zones based on their position/region
    if (zoneName.includes('North')) return 'zone-blue';
    if (zoneName.includes('South')) return 'zone-green';
    if (zoneName.includes('East')) return 'zone-yellow';
    if (zoneName.includes('West')) return 'zone-red';
    if (zoneName.includes('Central')) return 'zone-purple';
    
    return 'zone-gray'; // default
  };

  const getZoneInitial = () => {
    const zoneName = incident.zone || '';
    
    if (zoneName.includes('North')) return 'N';
    if (zoneName.includes('South')) return 'S';
    if (zoneName.includes('East')) return 'E';
    if (zoneName.includes('West')) return 'W';
    if (zoneName.includes('Central')) return 'C';
    
    return '?';
  };


  return (
    <div className="incident-card">
      <div className="card-header">
        <div className="zone-info">
          <div>
            <h4>
              {incident.description.toLowerCase()}
            </h4>
            <p className="time">
              {formatDate(incident.timestamp)}
            </p>
          </div>
        </div>
        <div className="status-badges">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
        </div>
      </div><div>
      <p className="noisetype-label">
              {incident.noisetype}
        </p>
        </div>
     <div className="card-tags">

        
        
        {incident.tags?.map((tag, index) => (<Tag key={index} label={tag} color="grey" />))}
      </div>
          <p className="zone-name">
              {incident.zone.replace('_', ' ').toUpperCase()}
        </p>

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