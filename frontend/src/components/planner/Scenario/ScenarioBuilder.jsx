import React, { useState, useEffect } from 'react';
import './ScenarioBuilder.css';
import { interventionServerService, interventionLocalService } from '../../services/interventionService';

const ScenarioBuilder = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedInterventions, setSelectedInterventions] = useState([]);
  const [availableInterventions, setAvailableInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch interventions on component mount
  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        setLoading(true);
        let interventions = await interventionServerService.getAll();
        
        if (!interventions || interventions.length === 0) {
          interventions = interventionLocalService.getAll();
        }
        
        setAvailableInterventions(interventions);
        setError(null);
      } catch (err) {
        console.error('Error fetching interventions:', err);
        setError('Failed to load interventions');
        setAvailableInterventions(interventionLocalService.getAll());
      } finally {
        setLoading(false);
      }
    };

    fetchInterventions();
  }, []);

  const toggleIntervention = (id) => {
    if (selectedInterventions.includes(id)) {
      setSelectedInterventions(selectedInterventions.filter(i => i !== id));
    } else {
      setSelectedInterventions([...selectedInterventions, id]);
    }
  };

  // Helper to get numeric cost from intervention (returns average cost)
  const getNumericCost = (intervention) => {
    const cost = intervention.cost || intervention.costRange;
    if (!cost) return 0;
    if (typeof cost === 'number') return cost;
    if (Array.isArray(cost)) return (cost[0] + cost[1]) / 2;
    if (cost.min !== undefined && cost.max !== undefined) return (cost.min + cost.max) / 2;
    return 0;
  };

  // Helper to get numeric impact min from intervention
  const getImpactMin = (intervention) => {
    const impact = intervention.impact || intervention.impactRange;
    if (!impact) return 0;
    if (typeof impact === 'number') return impact;
    if (Array.isArray(impact)) return impact[0] || 0;
    if (impact.min !== undefined) return impact.min;
    return 0;
  };

  // Helper to get numeric impact max from intervention
  const getImpactMax = (intervention) => {
    const impact = intervention.impact || intervention.impactRange;
    if (!impact) return 0;
    if (typeof impact === 'number') return impact;
    if (Array.isArray(impact)) return impact[1] || impact[0] || 0;
    if (impact.max !== undefined) return impact.max;
    return 0;
  };

  // Helper to get numeric feasibility (normalized to 0-10 scale)
  const getNumericFeasibility = (intervention) => {
    const feasibility = intervention.feasibility;
    if (feasibility === undefined || feasibility === null) return 0;
    if (typeof feasibility === 'number') {
      if (feasibility <= 1) return feasibility * 10;
      return feasibility;
    }
    return 0;
  };

  const calculateMetrics = () => {
    const selected = availableInterventions.filter(i => selectedInterventions.includes(i.id));
    
    const totalCost = selected.reduce((sum, int) => sum + getNumericCost(int), 0);
    
    const minImpact = selected.reduce((sum, int) => sum + getImpactMin(int), 0);
    const maxImpact = selected.reduce((sum, int) => sum + getImpactMax(int), 0);
    
    const avgFeasibility = selected.length > 0 
      ? selected.reduce((sum, int) => sum + getNumericFeasibility(int), 0) / selected.length
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
      id: `scenario-${Date.now()}`,
      name,
      description,
      interventionIds: selectedInterventions,
      metrics: {
        totalCost: metrics.totalCost,
        impact: { 
          min: metrics.minImpact, 
          max: metrics.maxImpact 
        },
        feasibility: metrics.avgFeasibility,
        timeline: metrics.avgFeasibility >= 7 ? '2-3 weeks' : metrics.avgFeasibility >= 4 ? '3-6 months' : '12-18 months'
      },
      scores: {
        cost: Math.max(0, Math.min(10, 10 - (metrics.totalCost / 50000))),
        impact: Math.min(10, ((metrics.minImpact + metrics.maxImpact) / 2) * 0.5),
        feasibility: metrics.avgFeasibility,
        total: 0
      },
      createdAt: new Date().toISOString()
    };
    
    newScenario.scores.total = (newScenario.scores.cost + newScenario.scores.impact + newScenario.scores.feasibility) / 3;

    onSave(newScenario);
  };

  const metrics = calculateMetrics();

  // Helper to format cost display
  const formatCostDisplay = (cost) => {
    if (cost === undefined || cost === null) return '£0';
    if (typeof cost === 'number') return `£${cost.toLocaleString()}`;
    if (Array.isArray(cost)) return `£${cost[0].toLocaleString()}-£${cost[1].toLocaleString()}`;
    if (cost.min !== undefined && cost.max !== undefined) return `£${cost.min.toLocaleString()}-£${cost.max.toLocaleString()}`;
    return `£${cost}`;
  };

  // Helper to format impact display
  const formatImpactDisplay = (impact) => {
    if (impact === undefined || impact === null) return '0 dB';
    if (typeof impact === 'number') return `${impact} dB`;
    if (Array.isArray(impact)) return `${impact[0]}-${impact[1]} dB`;
    if (impact.min !== undefined && impact.max !== undefined) return `${impact.min}-${impact.max} dB`;
    return `${impact} dB`;
  };


  const formatFeasibilityDisplay = (feasibility) => {
    if (feasibility === undefined || feasibility === null) return '0/10';
    if (typeof feasibility === 'number') {
      if (feasibility <= 1) return `${Math.round(feasibility * 10)}/10`;
      return `${Math.round(feasibility)}/10`;
    }
    return `${feasibility}/10`;
  };

  if (loading) {
    return (
      <div className="builder-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Create New Scenario</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="loading-state">
            <p>Loading interventions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && availableInterventions.length === 0) {
    return (
      <div className="builder-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Create New Scenario</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="error-state">
            <p>{error}</p>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

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
          <label>Select Interventions ({availableInterventions.length} available)</label>
          <div className="intervention-list">
            {availableInterventions.map(intervention => (
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
                    <span className="cost">{formatCostDisplay(intervention.cost || intervention.costRange)}</span>
                    <span className="impact">{formatImpactDisplay(intervention.impact || intervention.impactRange)}</span>
                    <span className="feasibility">Feasibility: {formatFeasibilityDisplay(intervention.feasibility)}</span>
                  </div>
                  {intervention.tags && intervention.tags.length > 0 && (
                    <div className="item-tags">
                      {intervention.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
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
                <strong>£{Math.round(metrics.totalCost).toLocaleString()}</strong>
              </div>
              <div className="metric">
                <span>Impact:</span>
                <strong>{Math.round(metrics.minImpact)}-{Math.round(metrics.maxImpact)} dB</strong>
              </div>
              <div className="metric">
                <span>Feasibility:</span>
                <strong>{Math.round(metrics.avgFeasibility)}/10</strong>
              </div>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            className="save-btn" 
            onClick={handleSave}
            disabled={!name.trim() || selectedInterventions.length === 0}
          >
            Save Scenario
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioBuilder;