import React from 'react';
import './ScenarioSelector.css';

const ScenarioSelector = ({ scenarios, selectedIds, onSelect, onAddNew }) => {
  return (
    <div className="selector-card">
      <div className="card-header">
        <h3>Scenarios</h3>
        <p>Select 2-3 to compare</p>
      </div>

      <div className="scenario-list">
        {scenarios.map(scenario => (
          <div
            key={scenario.id}
            className={`scenario-item ${selectedIds.includes(scenario.id) ? 'selected' : ''}`}
            onClick={() => onSelect(scenario.id)}
          >
            <div className="item-checkbox">
              <input
                type="checkbox"
                checked={selectedIds.includes(scenario.id)}
                readOnly
              />
            </div>
            <div className="item-content">
              <h4>{scenario.name}</h4>
              <p className="item-desc">{scenario.description}</p>
              <div className="item-meta">
                <span className="cost">£{scenario.metrics.totalCost}</span>
                <span className="impact">{scenario.metrics.impact.min}-{scenario.metrics.impact.max} dB</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="add-button" onClick={onAddNew}>
        ＋ Add New Scenario
      </button>
    </div>
  );
};

export default ScenarioSelector;