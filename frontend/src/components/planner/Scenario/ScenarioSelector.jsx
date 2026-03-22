import React from 'react';
import './ScenarioSelector.css';

const ScenarioSelector = ({ scenarios, selectedIds, onSelect, onAddNew, onDelete }) => {
  // Helper function to format currency for display
  const formatCurrency = (value) => {
    if (!value) return '£0';
    if (value >= 1000000) return `£${(value/1000000).toFixed(1)}M`;
    if (value >= 1000) return `£${(value/1000).toFixed(0)}k`;
    return `£${value}`;
  };

  // Helper function to format impact
  const formatImpact = (impact) => {
    if (!impact) return '0 dB';
    if (typeof impact === 'object') {
      return `${impact.min || 0}-${impact.max || 0} dB`;
    }
    return `${impact} dB`;
  };

  // Helper to check if max selections reached
  const isMaxSelections = selectedIds.length >= 3;

  // Helper to handle selection with validation
  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      onSelect(id); // Deselect
    } else if (selectedIds.length < 3) {
      onSelect(id); // Select
    } else {
      alert('You can only compare up to 3 scenarios at a time');
    }
  };

  return (
    <div className="scenario-selector-card">
      <div className="card-header">
        <div>
          <h3>Scenarios</h3>
          <p className="subtitle">
            {selectedIds.length}/3 selected
            {isMaxSelections && <span className="max-warning"> (maximum reached)</span>}
          </p>
        </div>
        <button className="refresh-button" onClick={() => window.location.reload()} title="Refresh">
          ↻
        </button>
      </div>

      {scenarios.length === 0 ? (
        <div className="empty-state">
          <p>No scenarios yet. Create your first one!</p>
        </div>
      ) : (
        <div className="scenario-list">
          {scenarios.map(scenario => {
            const isSelected = selectedIds.includes(scenario.id);
            const isDisabled = !isSelected && isMaxSelections;
            
            return (
              <div
                key={scenario.id}
                className={`scenario-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                onClick={() => !isDisabled && handleSelect(scenario.id)}
              >
                <div className="item-checkbox">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={isDisabled}
                    readOnly
                  />
                </div>
                
                <div className="item-content">
                  <div className="item-header">
                    <h4>{scenario.name}</h4>
                    {onDelete && (
                      <button 
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete "${scenario.name}"?`)) {
                            onDelete(scenario.id);
                          }
                        }}
                        title="Delete scenario"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  <p className="item-description">{scenario.description}</p>
                  
                  <div className="item-metrics">
                    <span className="metric-badge cost">
                       {formatCurrency(scenario.metrics?.totalCost)}
                    </span>
                    <span className="metric-badge impact">
                       {formatImpact(scenario.metrics?.impact)}
                    </span>
                    <span className="metric-badge feasibility">
                       {scenario.metrics?.feasibility?.toFixed(1) || '0'}/10
                    </span>
                  </div>
                  
                  <div className="item-footer">
                    <span className="intervention-count">
                      {scenario.interventionIds?.length || 0} interventions
                    </span>
                    <span className="created-date">
                      {new Date(scenario.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button className="add-scenario-button" onClick={onAddNew}>
        <span className="plus-icon">＋</span>
        Create New Scenario
      </button>
    </div>
  );
};

export default ScenarioSelector;