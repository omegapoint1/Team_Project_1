import { useState } from 'react';
import './IncidentFilters.css';
/*
Filter UI for incidentcard list. Onclick the values are passed back up to incident list
which calls the filter logic.
Renders the filter buttons and returns the target value.

*/




const IncidentFilters = ({ onFilterChange, initialFilters = {} }) => {

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
 const severityOptions = [1, 2, 3, 4, 5, 6, 7, 8,9,10];
 

  const [filters, setFilters] = useState({
    status: initialFilters.status || ['Pending', 'Accepted', 'Rejected'],
    zone: initialFilters.zone || 'all',
    severity: initialFilters.severity || 'all',
    timeRange: initialFilters.timeRange || 'all'
  });

  const handleFilterChange = (filterType, value) => {
    let newFilters;
    
    if (filterType === 'status') {
      newFilters = {
        ...filters,
        status: filters.status.includes(value)
          ? filters.status.filter(s => s !== value)
          : [...filters.status, value]
      };
    } else {
      newFilters = { ...filters, [filterType]: value };
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const statusOptions = [
    { value: 'Pending', label: 'Pending', color: 'yellow' },
    { value: 'Accepted', label: 'Accepted', color: 'green' },
    { value: 'Rejected', label: 'Rejected', color: 'red' }
  ];

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h2>Filter Incidents</h2>
        <button 
          onClick={() => {
            const reset = { 
              status: ['Pending', 'Accepted', 'Rejected'], 
              zone: 'all', 
              severity: 'all', 
              timeRange: 'all' 
            };
            setFilters(reset);
            onFilterChange(reset);
          }}
          className="reset-button"
        >
          Reset Filters
        </button>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <div className="status-checkboxes">
            {statusOptions.map(option => (
              <label key={option.value} className="status-checkbox">
                <input
                  type="checkbox"
                  checked={filters.status.includes(option.value)}
                  onChange={() => handleFilterChange('status', option.value)}
                />
                <span >{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label className="filter-label">Zone</label>
          <select
            value={filters.zone}
            onChange={(e) => handleFilterChange('zone', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Zones</option>
            {zones.map(zone => (
              <option key={zone.id} value={zone.name}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>
        

        
        <div className="filter-group">
          <label className="filter-label">Severity (1-8)</label>
          <select
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Severities</option>
            {severityOptions.map(severity => (
              <option key={severity} value={severity}>
               {severity}
              </option>
            ))}
          </select>
        </div>
        

        
        <div className="filter-group">
          <label className="filter-label">Time Range</label>
          <select
            value={filters.timeRange}
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
            className="filter-select"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
            <option value="all">All Time</option>
          </select>
        </div>
        
      </div>
    </div>
  );
};

export default IncidentFilters;