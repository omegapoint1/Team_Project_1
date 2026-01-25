import { useState, useEffect } from 'react';
import IncidentFilters from './IncidentFilters';
import IncidentCard from './IncidentCard';
import IncidentDetailModal from './IncidentDetailModal';
import ScrollableContainer from '../../common/ScrollableContainer';
import './IncidentList.css';

const mockIncidents = [
   /*Mock incidents made by external random generator based on predicted json format **To be moved to 
   to external json file*/
  {
    id: 'INC-001',
    zone: 'zone_a',
    timestamp: '2024-01-20T22:30:00Z',
    category: 'noise',
    description: 'Empty',
    severity: 'high',
    status: 'pending',
    tags: []
  },
  {
    id: 'INC-002',
    zone: 'zone_b',
    timestamp: '2024-01-20T23:15:00Z',
    category: 'music',
    description: 'Loud music from weekend party affecting nearby apartments.',
    severity: 'medium',
    status: 'valid',
    tags: ['music', 'weekend', 'party']
  },
  {
    id: 'INC-003',
    zone: 'zone_a',
    timestamp: '2024-01-20T20:30:00Z',
    category: 'traffic',
    description: 'Traffic jam driving me mental',
    severity: 'low',
    status: 'processed',
    tags: ['traffic', 'rush hour', 'horn']
  },
  {
    id: 'INC-004',
    zone: 'zone_d',
    timestamp: '2024-01-19T18:15:00Z',
    category: 'events',
    description: ' outdoor concert exceeding permitted noise levels.',
    severity: 'medium',
    status: 'valid',
    tags: ['event', 'concert', 'music']
  },
  {
    id: 'INC-005',
    zone: 'zone_b',
    timestamp: '2024-01-19T14:30:00Z',
    category: 'construction',
    description: 'Fire station enxt to care home causing havoc',
    severity: 'high',
    status: 'duplicate',
    tags: ['fire station', 'elderly', 'care-home']
  },
  {
    id: 'INC-006',
    zone: 'zone_c',
    timestamp: '2024-01-18T11:15:00Z',
    category: 'other',
    description: 'Industrial factory disturbing school in early moring',
    severity: 'low',
    status: 'invalid',
    tags: ['industrial', 'children']
  },
  {
    id: 'INC-007',
    zone: 'zone_a',
    timestamp: '2024-01-18T09:45:00Z',
    category: 'construction',
    description: 'Early morning drilling work is distrubing me.',
    severity: 'medium',
    status: 'valid',
    tags: ['drilling', 'morning', 'residential']
  }
];

const IncidentList = () => {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [filteredIncidents, setFilteredIncidents] = useState(mockIncidents);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filters, setFilters] = useState({
    status: ['valid'],
    zone: 'all',
    category: 'all',
    severity: 'all',
    timeRange: '7d'
  });

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
        const incidentDate = new Date(incident.timestamp);
        return incidentDate >= cutoff;
      });
    }

    setFilteredIncidents(filtered);
  }, [filters, incidents]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleStatusUpdate = (incidentId, newStatus, notes = '') => {
    console.log(`Updating incident ${incidentId} to ${newStatus}: ${notes}`);
    
    setIncidents(prev => 
      prev.map(inc => 
        inc.id === incidentId ? { 
          ...inc, 
          status: newStatus,
          processedAt: new Date().toISOString(),
          processorNotes: notes
        } : inc
      )
    );
    
    alert(`Incident ${incidentId} marked as ${newStatus}`);
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

            </button>
            <button 
              onClick={handleReport}
              className="icon-button"
              title="Generate Report"
            >

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