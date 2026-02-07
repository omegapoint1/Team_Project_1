import React from 'react';

const WeightControls = ({ weights, onChange }) => {
  const handleChange = (metric, value) => {
    const newValue = parseInt(value);
    if (!isNaN(newValue)) {
      onChange({ ...weights, [metric]: newValue });
    }
  };

  return (
    <div className="weights-card">
      <h3>Priority Weights</h3>
      
      <div className="weight-controls">
        <div className="weight-item">
          <label>Cost: {weights.cost}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.cost}
            onChange={(e) => handleChange('cost', e.target.value)}
          />
        </div>
        
        <div className="weight-item">
          <label>Impact: {weights.impact}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.impact}
            onChange={(e) => handleChange('impact', e.target.value)}
          />
        </div>
        
        <div className="weight-item">
          <label>Feasibility: {weights.feasibility}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={weights.feasibility}
            onChange={(e) => handleChange('feasibility', e.target.value)}
          />
        </div>
      </div>
      
      <div className="weight-total">
        Total: {weights.cost + weights.impact + weights.feasibility}%
      </div>
    </div>
  );
};

export default WeightControls;