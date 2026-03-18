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
        // Try server first, fall back to local
        let interventions = await interventionServerService.getAll();
        
        // If server returns empty, try local
        if (!interventions || interventions.length === 0) {
          interventions = interventionLocalService.getAll();
        }
        
        setAvailableInterventions(interventions);
        setError(null);
      } catch (err) {
        console.error('Error fetching interventions:', err);
        setError('Failed to load interventions');
        // Fallback to local
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

  const calculateMetrics = () => {
    const selected = availableInterventions.filter(i => selectedInterventions.includes(i.id));
    
    const totalCost = selected.reduce((sum, int) => sum + (int.cost || 0), 0);
    
    // Handle impact which could be object {min, max} or direct values
    const minImpact = selected.reduce((sum, int) => {
      if (typeof int.impact === 'object' && int.impact !== null) {
        return sum + (int.impact.min || 0);
      }
      return sum + (int.impact || 0);
    }, 0);
    
    const maxImpact = selected.reduce((sum, int) => {
      if (typeof int.impact === 'object' && int.impact !== null) {
        return sum + (int.impact.max || int.impact.min || 0);
      }
      return sum + (int.impact || 0);
    }, 0);
    
    const avgFeasibility = selected.length > 0 
      ? selected.reduce((sum, int) => sum + (int.feasibility || 0), 0) / selected.length
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
        timeline: '3-4 weeks'
      },
      scores: {
        cost: Math.max(0, 10 - (metrics.totalCost / 10000)),
        impact: ((metrics.minImpact + metrics.maxImpact) / 2) * 0.5,
        feasibility: metrics.avgFeasibility * 10,
        total: 7.5 // This could be calculated based on weights
      },
      createdAt: new Date().toISOString()
    };

    onSave(newScenario);
  };

  const metrics = calculateMetrics();

  // Helper to format cost
  const formatCost = (cost) => {
    if (typeof cost === 'object' && cost !== null) {
      return `£${cost.min}-${cost.max}`;
    }
    return `£${cost}`;
  };

  // Helper to format impact
  const formatImpact = (impact) => {
    if (typeof impact === 'object' && impact !== null) {
      return `${impact.min}-${impact.max} dB`;
    }
    return `${impact} dB`;
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
                    <span className="cost">{formatCost(intervention.cost)}</span>
                    <span className="impact">{formatImpact(intervention.impact)}</span>
                    <span className="feasibility">Feasibility: {intervention.feasibility}/10</span>
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
                <strong>£{metrics.totalCost.toLocaleString()}</strong>
              </div>
              <div className="metric">
                <span>Impact:</span>
                <strong>{metrics.minImpact.toFixed(1)}-{metrics.maxImpact.toFixed(1)} dB</strong>
              </div>
              <div className="metric">
                <span>Feasibility:</span>
                <strong>{metrics.avgFeasibility.toFixed(2)}/10</strong>
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