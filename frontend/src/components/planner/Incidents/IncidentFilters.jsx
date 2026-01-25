import { useState } from 'react';
import './IncidentFilters.css';

const IncidentFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    status: initialFilters.status || ['valid'], // Default: valid only
    zone: initialFilters.zone || 'all',
    category: initialFilters.category || 'all',
    severity: initialFilters.severity || 'all',
    timeRange: initialFilters.timeRange || '7d'
  });

  const handleFilterChange = (filterType, value) => {
    let newFilters;
    
    if (filterType === 'status') {
      // Toggle status in array
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
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'valid', label: 'Valid', color: 'green' },
    { value: 'processed', label: 'Processed', color: 'blue' },
    { value: 'duplicate', label: 'Duplicate', color: 'orange' },
    { value: 'invalid', label: 'Invalid', color: 'red' }
  ];

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h2>Filter Incidents</h2>
        <button 
          onClick={() => {
            const reset = { status: ['valid'], zone: 'all', category: 'all', severity: 'all', timeRange: '7d' };
            setFilters(reset);
            onFilterChange(reset);
          }}
          className="reset-button"
        >
          Reset Filters
        </button>
      </div>

      {/* Status Filter (Checkboxes) */}
      <div className="filter-section">
        <label className="filter-label">Status</label>
        <div className="status-options">
          {statusOptions.map(option => (
            <label key={option.value} className="status-option">
              <input
                type="checkbox"
                checked={filters.status.includes(option.value)}
                onChange={() => handleFilterChange('status', option.value)}
                className={`status-checkbox ${option.color}`}
              />
              <span className="status-label">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Other Filters in Grid */}
      <div className="filters-grid">
        {/* Zone Filter */}
        <div className="filter-group">
          <label className="filter-label">Zone</label>
          <select
            value={filters.zone}
            onChange={(e) => handleFilterChange('zone', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Zones</option>
            <option value="zone_a">Zone A</option>
            <option value="zone_b">Zone B</option>
            <option value="zone_c">Zone C</option>
            <option value="zone_d">Zone D</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="construction">Construction</option>
            <option value="music">Music</option>
            <option value="traffic">Traffic</option>
            <option value="events">Events</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div className="filter-group">
          <label className="filter-label">Severity</label>
          <select
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Time Range Filter */}
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

      {/* Active Filters Summary */}
      {filters.status.length > 0 && (
        <div className="active-filters">
          <div className="filters-summary">
            <span className="summary-label">Active filters:</span>
            {filters.status.map(status => (
              <span key={status} className="filter-tag">
                {statusOptions.find(s => s.value === status)?.label}
              </span>
            ))}
            {filters.zone !== 'all' && (
              <span className="filter-tag">
                Zone: {filters.zone}
              </span>
            )}
            {filters.severity !== 'all' && (
              <span className="filter-tag">
                Severity: {filters.severity}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentFilters;