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
  const [syncStatus, setSyncStatus] = useState('synced');
  
  const [filters, setFilters] = useState({
    status: ['Pending'], 
    zone: 'all',
    severity: 'all',
    timeRange: '7d'
  });

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadIncidents = async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setSyncStatus('syncing');
      
      let serverData = [];
      try {
        serverData = await incidentServerService.getAll();
        console.log('Server data loaded:', serverData.length);
      } catch (serverError) {
        console.log('Failed to load incidents from server:', serverError);
        setSyncStatus('offline');
      }
      
      if (serverData.length > 0) {
        incidentLocalService.saveAll(serverData);
        setIncidents(serverData);
        setSyncStatus('synced');
      } else {
        const localData = incidentLocalService.getAll();
        setIncidents(localData);
        setSyncStatus('local-only');
      }
      
    } catch (error) {
      console.error('Error loading incidents:', error);
      const localData = incidentLocalService.getAll();
      setIncidents(localData);
      setSyncStatus('error');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    loadIncidents();
  }, []);
  
  const handleRefresh = async () => {
    await loadIncidents(true);
  };

  const handleIncidentUpdate = async (updatedIncident) => {
    try {
      const stringId = String(updatedIncident.id);
      
      let serverSuccess = false;
      let serverResult = null;
      
      try {
        serverResult = await incidentServerService.update(stringId, updatedIncident);
        if (serverResult) {
          serverSuccess = true;
          console.log('Server update successful');
        }
      } catch (error) {
        console.log('Server update failed:', error);
      }
      
      if (serverSuccess && serverResult) {
        setIncidents(prev => {
          const updated = prev.map(inc =>
            String(inc.id) === stringId ? serverResult : inc
          );
          incidentLocalService.saveAll(updated);
          return updated;
        });
      } else {
        const incidentWithSyncStatus = {
          ...updatedIncident,
          _synced: false,
          _lastUpdated: new Date().toISOString(),
          id: stringId
        };
        
        setIncidents(prev => {
          const updated = prev.map(inc =>
            String(inc.id) === stringId ? incidentWithSyncStatus : inc
          );
          incidentLocalService.saveAll(updated);
          return updated;
        });

        setSyncStatus('unsynced');
        alert('Changes saved locally. Will sync when connection restored.');
      }
      
    } catch (error) {
      console.log('Error updating incident:', error);
      throw error;
    }
  };

  const handleStatusUpdate = async (incidentId, newStatus, notes = '') => {
    const currentIncident = incidents.find(inc => String(inc.id) === String(incidentId));
    if (!currentIncident) {
      console.error('Incident not found:', incidentId);
      return;
    }

    if (!newStatus || typeof newStatus !== 'string') {
      console.error('Invalid status provided:', newStatus);
      alert('Invalid status value');
      return;
    }

    const capitalizedStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase();
    
    const updatedIncident = {
      ...currentIncident,
      status: capitalizedStatus,
      ...(notes && { processingNotes: notes }),
      updated_at: new Date().toISOString()
    };

    try {
      await handleIncidentUpdate(updatedIncident);
      alert(`Incident ${incidentId} marked as ${capitalizedStatus}`);
    } catch (error) {
      console.error('Failed to update incident status:', error);
      alert('Failed to update incident status');
    }
  };
  // Filter incidents
  useEffect(() => {
    let filtered = [...incidents];
    
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(incident => {
        const incidentStatus = (incident.status || '').toLowerCase();
        return filters.status.some(status => 
          status.toLowerCase() === incidentStatus
        );
      });
    }
    
    if (filters.zone && filters.zone !== 'all') {
      filtered = filtered.filter(incident => 
        incident.zone === filters.zone
      );
    }
    
    if (filters.severity && filters.severity !== 'all') {
      const severityNum = parseInt(filters.severity);
      filtered = filtered.filter(incident => {
        const incidentSeverity = parseInt(incident.severity);
        return incidentSeverity === severityNum;
      });
    }
    
    if (filters.timeRange && filters.timeRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      const timeRanges = {
        '1d': 1,
        '7d': 7,
        '30d': 30,
        '90d': 90
      };
      
      const days = timeRanges[filters.timeRange];
      if (days) {
        cutoff.setDate(now.getDate() - days);
        filtered = filtered.filter(incident => {
          const incidentDate = new Date(incident.datetime || incident.created_at || incident.createdAt);
          return incidentDate >= cutoff;
        });
      }
    }
    
    setFilteredIncidents(filtered);
    
  }, [filters, incidents]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewMore = (incident) => {
    setSelectedIncident(incident);
  };


  const getStatusCount = (status, source = incidents) => {
    if (!status) return 0;
    return source.filter(inc =>
      (inc.status || '').toLowerCase() === status.toLowerCase()
    ).length;
  };

  const getSyncStatusIcon = () => {
    switch(syncStatus) {
      case 'synced': return '✅';
      case 'syncing': return '🔄';
      case 'unsynced': return '⚠️';
      case 'offline': return '📡';
      case 'local-only': return '💾';
      default: return '❓';
    }
  };

  const getSyncStatusText = () => {
    switch(syncStatus) {
      case 'synced': return 'Synced with server';
      case 'syncing': return 'Syncing...';
      case 'unsynced': return 'Unsynced changes';
      case 'offline': return 'Offline mode';
      case 'local-only': return 'Local only';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return <div className="loading">Loading incidents...</div>;
  }

  return (
    <div className="incident-list-container">
      <div className="incident-header">
        <h1>Incident Management</h1>
        <div className="sync-status">
          <span className="sync-icon">{getSyncStatusIcon()}</span>
          <span className="sync-text">{getSyncStatusText()}</span>
        </div>
        <p>Review and process noise incident reports</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number total">{incidents.length}</div>
          <div className="stat-label">Total Incidents</div>
        </div>
        <div className="stat-card">
          <div className="stat-number pending">{getStatusCount('Pending')}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number accepted">{getStatusCount('Accepted')}</div>
          <div className="stat-label">Accepted</div>
        </div>
        <div className="stat-card">
          <div className="stat-number rejected">{getStatusCount('Rejected')}</div>
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
          </div>
        }
        footer={
          <div className="scrollable-footer">
            <div>
              {isRefreshing && <span className="refreshing-text"> (Refreshing...)</span>}
              {syncStatus === 'unsynced' && (
                <span className="unsynced-warning"> ⚠️ Some changes not synced</span>
              )}
            </div>
            <div className="footer-actions">
              <button 
                onClick={handleRefresh}
                className="text-button"
                disabled={isRefreshing}
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
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