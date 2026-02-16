import { useState, useEffect } from 'react';
import IncidentFilters from './IncidentFilters';
import IncidentCard from './IncidentCard';
import IncidentDetailModal from './IncidentDetailModal';
import ScrollableContainer from '../../common/ScrollableContainer';
import { incidentServerService } from '../../services/incidentService';
import { incidentLocalService } from '../../services/incidentService';
import './IncidentList.css';

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filters, setFilters] = useState({
    status: ['valid'],
    zone: 'all',
    category: 'all',
    severity: 'all',
    timeRange: '7d'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        setLoading(true);

        const freshData = await incidentServerService.getAll();
        setIncidents(freshData);
      } catch (error) {
        console.log('Failed to load incidents from server:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadIncidents();
  }, []); // on mount

  //Update incident. update server first, then local
  const handleIncidentUpdate = async (updatedIncident) => {
    try {
      const serverResponse = await incidentServerService.update(updatedIncident);
      
      setIncidents(prev => 
        prev.map(inc => inc.id === updatedIncident.id ? serverResponse : inc)
      );
      
      incidentLocalService.update(serverResponse);
      
      return serverResponse;
    } catch (error) {
      console.log('Server update failed:', error);
      throw error;
    }
  };

  const handleStatusUpdate = async (incidentId, newStatus, notes = '') => {
    const currentIncident = incidents.find(inc => inc.id === incidentId);
    if (!currentIncident) return;

    const updatedIncident = {
      ...currentIncident,
      status: newStatus,
      ...(notes && { moderation_notes: notes })
    };

    try {

      await handleIncidentUpdate(updatedIncident);
      alert(`Incident ${incidentId} marked as ${newStatus}`);
    } catch (error) {
      alert('Failed to update incident status');
    }
  };

  useEffect(() => {
    let filtered = [...incidents];

    if (filters.status.length > 0) {
      filtered = filtered.filter(incident => 
        filters.status.includes(incident.status)
      );
    }

    if (filters.zone !== 'all') {
      filtered = filtered.filter(incident => incident.zone === filters.zone);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(incident => incident.category === filters.category);
    }

    if (filters.severity !== 'all') {
      filtered = filtered.filter(incident => incident.severity === filters.severity);
    }

    if (filters.timeRange !== 'all') {
      const days = parseInt(filters.timeRange);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      
      filtered = filtered.filter(incident => {
        const incidentDate = new Date(incident.timestamp || incident.datetime);
        return incidentDate >= cutoff;
      });
    }

    setFilteredIncidents(filtered);
  }, [filters, incidents]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewMore = (incident) => {
    setSelectedIncident(incident);
  };

  const getStatusCount = (status) => {
    return incidents.filter(inc => inc.status === status).length;
  };

  const handleExport = () => {
    alert(`Exporting ${filteredIncidents.length} incidents as CSV`);
  };

  const handleReport = () => {
    alert('Generating incident report');
  };

  if (loading) {
    return <div className="loading">Loading incidents...</div>;
  }

  return (
    <div className="incident-list-container">
      <div className="incident-header">
        <h1>Incident Management</h1>
        <p>Review and process noise incident reports</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number total">{incidents.length}</div>
          <div className="stat-label">Total Incidents</div>
        </div>
        <div className="stat-card">
          <div className="stat-number pending">{getStatusCount('pending')}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number valid">{getStatusCount('valid')}</div>
          <div className="stat-label">Valid</div>
        </div>
        <div className="stat-card">
          <div className="stat-number processed">{getStatusCount('processed')}</div>
          <div className="stat-label">Processed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number filtered">
            {getStatusCount('duplicate') + getStatusCount('invalid')}
          </div>
          <div className="stat-label">Filtered Out</div>
        </div>
      </div>

      <IncidentFilters 
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      <ScrollableContainer
        maxHeight="600px"
        columns={3}
        showHeader={true}
        headerTitle={`Incident Reports (${filteredIncidents.length})`}
        headerActions={
          <div className="header-actions">
            <button 
              onClick={handleExport}
              className="icon-button"
              title="Export as CSV"
            >
              📥
            </button>
            <button 
              onClick={handleReport}
              className="icon-button"
              title="Generate Report"
            >
              📊
            </button>
          </div>
        }
        footer={
          <div className="scrollable-footer">
            <div>
              <span className="bold">{filteredIncidents.length}</span> of{' '}
              <span className="bold">{incidents.length}</span> incidents
            </div>
            <div className="footer-actions">
              <button 
                onClick={handleExport}
                className="text-button"
              >
                Export as CSV
              </button>
              <button 
                onClick={handleReport}
                className="text-button"
              >
                Generate Report
              </button>
            </div>
          </div>
        }
        emptyState={
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No incidents found</h3>
            <p>Try adjusting your filters</p>
          </div>
        }
      >
        {filteredIncidents.map(incident => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            onViewMore={handleViewMore}
          />
        ))}
      </ScrollableContainer>

      <IncidentDetailModal
        isOpen={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        incident={selectedIncident}
        onUpdateStatus={handleStatusUpdate}
      />
    </div>
  );
};

export default IncidentList;