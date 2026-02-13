import React, { useState } from 'react';
import './ScenarioBuilder.css';
import { mockInterventions } from '../PlannerData/scenarioData';

const ScenarioBuilder = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedInterventions, setSelectedInterventions] = useState([]);

  const toggleIntervention = (id) => {
    if (selectedInterventions.includes(id)) {
      setSelectedInterventions(selectedInterventions.filter(i => i !== id));
    } else {
      setSelectedInterventions([...selectedInterventions, id]);
    }
  };

  const calculateMetrics = () => {
    const selected = mockInterventions.filter(i => selectedInterventions.includes(i.id));
    
    const totalCost = selected.reduce((sum, int) => sum + int.cost, 0);
    const minImpact = selected.reduce((sum, int) => sum + int.impact.min, 0);
    const maxImpact = selected.reduce((sum, int) => sum + int.impact.max, 0);
    const avgFeasibility = selected.length > 0 
      ? selected.reduce((sum, int) => sum + int.feasibility, 0) / selected.length
      : 0;

    return { totalCost, minImpact, maxImpact, avgFeasibility };
  };

  const handleSave = () => {
    if (!name.trim() || selectedInterventions.length === 0) {
      alert('Please provide a name and select at least one intervention');
      return;
    }

    const metrics = calculateMetrics();
    const newScenario = {
      id: `scenario${Date.now()}`,
      name,
      description,
      metrics: {
        totalCost: metrics.totalCost,
        impact: { min: metrics.minImpact, max: metrics.maxImpact },
        feasibility: metrics.avgFeasibility,
        timeline: '3-4 weeks'
      },
      scores: {
        cost: Math.max(0, 10 - (metrics.totalCost / 1000)),
        impact: ((metrics.minImpact + metrics.maxImpact) / 2) * 0.5,
        feasibility: metrics.avgFeasibility * 10,
        total: 7.5
      }
    };

    onSave(newScenario);
  };

  const metrics = calculateMetrics();

  return (
    <div className="builder-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create New Scenario</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="form-group">
          <label>Scenario Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter scenario name"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this scenario..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Select Interventions</label>
          <div className="intervention-list">
            {mockInterventions.map(intervention => (
              <div
                key={intervention.id}
                className={`intervention-item ${selectedInterventions.includes(intervention.id) ? 'selected' : ''}`}
                onClick={() => toggleIntervention(intervention.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedInterventions.includes(intervention.id)}
                  readOnly
                />
                <div className="item-info">
                  <h5>{intervention.name}</h5>
                  <p>{intervention.description}</p>
                  <div className="item-meta">
                    <span>£{intervention.cost}</span>
                    <span>{intervention.impact.min}-{intervention.impact.max} dB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedInterventions.length > 0 && (
          <div className="preview">
            <h4>Preview</h4>
            <div className="preview-metrics">
              <div className="metric">
                <span>Cost:</span>
                <strong>£{metrics.totalCost}</strong>
              </div>
              <div className="metric">
                <span>Impact:</span>
                <strong>{metrics.minImpact}-{metrics.maxImpact} dB</strong>
              </div>
              <div className="metric">
                <span>Feasibility:</span>
                <strong>{metrics.avgFeasibility.toFixed(2)}/1.0</strong>
              </div>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save Scenario</button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioBuilder;