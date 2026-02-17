import { useState, useEffect, useCallback } from 'react';
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
  
  // Zone list matching the zones from IncidentFilters
  const zones = [
    { id: 1, name: "North-West" },
    { id: 2, name: "North-Central-West" },
    { id: 3, name: "North-Central-East" },
    { id: 4, name: "North-East" },
    { id: 5, name: "Central-North-West" },
    { id: 6, name: "Central-North-Central-West" },
    { id: 7, name: "Central-North-Central-East" },
    { id: 8, name: "Central-North-East" },
    { id: 9, name: "Central-South-West" },
    { id: 10, name: "Central-South-Central-West" },
    { id: 11, name: "Central-South-Central-East" },
    { id: 12, name: "Central-South-East" },
    { id: 13, name: "South-West" },
    { id: 14, name: "South-Central-West" },
    { id: 15, name: "South-Central-East" },
    { id: 16, name: "South-East" },
  ];

  const [filters, setFilters] = useState({
    status: ['pending'], 
    zone: 'all',
    severity: 'all',
    timeRange: '7d'
  });

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadIncidents = useCallback(async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      let freshData;
      try {
        freshData = await incidentServerService.getAll();
      } catch (serverError) {
        console.log('Failed to load incidents from server:', serverError);
        freshData = incidentLocalService.getAll();
      }

      if (freshData && freshData.length > 0) {
        incidentLocalService.saveAll(freshData);
      }

      setIncidents(freshData || []);
    } catch (error) {
      console.error('Error loading incidents:', error);
      const localData = incidentLocalService.getAll();
      setIncidents(localData || []);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  const handleRefresh = async () => {
    await loadIncidents(true);
  };

  const handleIncidentUpdate = async (updatedIncident) => {
    try {
      try {
        await incidentServerService.update(updatedIncident);
      } catch (error) {
        console.log('Server update failed:', error);
      }
      
      incidentLocalService.update(updatedIncident);
      
      setIncidents(prev => 
        prev.map(inc => inc.id === updatedIncident.id ? updatedIncident : inc)
      );
      
    } catch (error) {
      console.log('Error updating incident:', error);
      throw error;
    }
  };

  const handleStatusUpdate = async (incidentId, newStatus, notes = '') => {
    const currentIncident = incidents.find(inc => inc.id === incidentId);
    if (!currentIncident) return;

    const updatedIncident = {
      ...currentIncident,
      status: newStatus,
      ...(notes && { moderation_notes: notes }),
      updated_at: new Date().toISOString()
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

    /*if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(incident => 
        filters.status.includes(incident.status)
      );
    }*/

    /*Zone filter 
    if (filters.zone !== 'all') {
      const selectedZone = zones.find(z => z.id.toString() === filters.zone.toString());
      if (selectedZone) {
        filtered = filtered.filter(incident => incident.zone === selectedZone.name);
      }
    }
    */

    /*sevrity filter
    if (filters.severity !== 'all') {
      const severityNum = parseInt(filters.severity);
      filtered = filtered.filter(incident => 
        parseInt(incident.severity) === severityNum
      );
    }
    */

    /* time range filter 
    if (filters.timeRange !== 'all') {
      const days = parseInt(filters.timeRange);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      
      filtered = filtered.filter(incident => {
        const incidentDate = new Date(incident.timestamp || incident.datetime);
        return incidentDate >= cutoff;
      });
    }
    */

    setFilteredIncidents(filtered);
  }, [filters, incidents]); // Removed zones from dependencies

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
          <div className="stat-number accepted">{getStatusCount('accepted')}</div>
          <div className="stat-label">Accepted</div>
        </div>
        <div className="stat-card">
          <div className="stat-number rejected">{getStatusCount('rejected')}</div>
          <div className="stat-label">Rejected</div>
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
              onClick={handleRefresh}
              className={`icon-button ${isRefreshing ? 'refreshing' : ''}`}
              title="Refresh incidents"
              disabled={isRefreshing}
            >
              {isRefreshing ? '⏳' : '🔄'}
            </button>
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
              {isRefreshing && <span className="refreshing-text"> (Refreshing...)</span>}
            </div>
            <div className="footer-actions">
              <button 
                onClick={handleRefresh}
                className="text-button"
                disabled={isRefreshing}
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
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
            <button 
              onClick={handleRefresh}
              className="refresh-button"
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        }
      >
        {filteredIncidents.map(incident => (
          <IncidentCard
            key={`${incident.id}-${incident.status}`}
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