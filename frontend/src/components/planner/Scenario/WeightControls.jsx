import React, { useState, useEffect } from 'react';
import './WeightControls.css';

const WeightControls = ({ weights, onChange }) => {
  const [localWeights, setLocalWeights] = useState(weights);
  const [total, setTotal] = useState(weights.cost + weights.impact + weights.feasibility);

  useEffect(() => {
    setLocalWeights(weights);
    setTotal(weights.cost + weights.impact + weights.feasibility);
  }, [weights]);

  const handleChange = (metric, value) => {
    const newValue = parseInt(value) || 0;
    
    const currentTotal = localWeights.cost + localWeights.impact + localWeights.feasibility;
    const oldValue = localWeights[metric];
    const newTotal = currentTotal - oldValue + newValue;
    
    if (newTotal > 100) {
      const excess = newTotal - 100;
      const otherMetrics = ['cost', 'impact', 'feasibility'].filter(m => m !== metric);
      
      const totalOther = otherMetrics.reduce((sum, m) => sum + localWeights[m], 0);
      
      if (totalOther > 0) {
        const updatedWeights = { ...localWeights, [metric]: newValue };
        
        otherMetrics.forEach(m => {
          const proportion = localWeights[m] / totalOther;
          const reduction = Math.min(localWeights[m], Math.ceil(excess * proportion));
          updatedWeights[m] = Math.max(0, localWeights[m] - reduction);
        });
        
        const newTotal = updatedWeights.cost + updatedWeights.impact + updatedWeights.feasibility;
        
        if (newTotal > 100) {
          const sorted = otherMetrics.sort((a, b) => updatedWeights[b] - updatedWeights[a]);
          updatedWeights[sorted[0]] -= (newTotal - 100);
        }
        
        setLocalWeights(updatedWeights);
        setTotal(updatedWeights.cost + updatedWeights.impact + updatedWeights.feasibility);
        onChange(updatedWeights);
      }
    } else {
      const updatedWeights = { ...localWeights, [metric]: newValue };
      setLocalWeights(updatedWeights);
      setTotal(newTotal);
      onChange(updatedWeights);
    }
  };

  const handleIncrement = (metric, increment) => {
    const currentValue = localWeights[metric];
    const newValue = Math.min(100, Math.max(0, currentValue + increment));
    handleChange(metric, newValue);
  };

  const handleReset = () => {
    const defaultWeights = { cost: 40, impact: 40, feasibility: 20 };
    setLocalWeights(defaultWeights);
    setTotal(100);
    onChange(defaultWeights);
  };

  const handleEqualize = () => {
    const base = Math.floor(100 / 3);
    const remainder = 100 - (base * 3);
    
    const equalWeights = {
      cost: base + (remainder > 0 ? 1 : 0),
      impact: base + (remainder > 1 ? 1 : 0),
      feasibility: base
    };
    
    setLocalWeights(equalWeights);
    setTotal(100);
    onChange(equalWeights);
  };

  const getTotalColor = () => {
    if (total === 100) return '#10b981'; 
    if (total < 100) return '#f59e0b';  
    return '#ef4444';                     
  };

  return (
    <div className="weights-card">
      <div className="weights-header">
        <h3>Priority Weights</h3>
        <div className="weight-actions">
          <button onClick={handleReset} className="reset-btn" title="Reset to defaults">
            ↺
          </button>
          <button onClick={handleEqualize} className="equalize-btn" title="Make equal">
            ⚖️
          </button>
        </div>
      </div>
      
      <div className="weight-controls">
        {/* Cost Slider */}
        <div className="weight-item">
          <div className="weight-label">
            <label>Cost</label>
            <div className="weight-value-controls">
              <span className="weight-value">{localWeights.cost}%</span>
              <button 
                className="weight-btn minus"
                onClick={() => handleIncrement('cost', -5)}
                disabled={localWeights.cost <= 0}
              >−</button>
              <button 
                className="weight-btn plus"
                onClick={() => handleIncrement('cost', 5)}
                disabled={localWeights.cost >= 100}
              >+</button>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={localWeights.cost}
            onChange={(e) => handleChange('cost', e.target.value)}
            className="weight-slider"
            style={{
              background: `linear-gradient(to right, #2196f3 0%, #2196f3 ${localWeights.cost}%, #e0e0e0 ${localWeights.cost}%)`
            }}
          />
        </div>
        
        {/* Impact Slider */}
        <div className="weight-item">
          <div className="weight-label">
            <label>Impact</label>
            <div className="weight-value-controls">
              <span className="weight-value">{localWeights.impact}%</span>
              <button 
                className="weight-btn minus"
                onClick={() => handleIncrement('impact', -5)}
                disabled={localWeights.impact <= 0}
              >−</button>
              <button 
                className="weight-btn plus"
                onClick={() => handleIncrement('impact', 5)}
                disabled={localWeights.impact >= 100}
              >+</button>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={localWeights.impact}
            onChange={(e) => handleChange('impact', e.target.value)}
            className="weight-slider"
            style={{
              background: `linear-gradient(to right, #4caf50 0%, #4caf50 ${localWeights.impact}%, #e0e0e0 ${localWeights.impact}%)`
            }}
          />
        </div>
        
        {/* Feasibility Slider */}
        <div className="weight-item">
          <div className="weight-label">
            <label>Feasibility</label>
            <div className="weight-value-controls">
              <span className="weight-value">{localWeights.feasibility}%</span>
              <button 
                className="weight-btn minus"
                onClick={() => handleIncrement('feasibility', -5)}
                disabled={localWeights.feasibility <= 0}
              >−</button>
              <button 
                className="weight-btn plus"
                onClick={() => handleIncrement('feasibility', 5)}
                disabled={localWeights.feasibility >= 100}
              >+</button>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={localWeights.feasibility}
            onChange={(e) => handleChange('feasibility', e.target.value)}
            className="weight-slider"
            style={{
              background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${localWeights.feasibility}%, #e0e0e0 ${localWeights.feasibility}%)`
            }}
          />
        </div>
      </div>
      
      <div className="weight-footer">
        <div className="weight-total" style={{ color: getTotalColor() }}>
          <span>Total:</span>
          <strong>{total}%</strong>
          {total !== 100 && (
            <span className="total-warning">
              {total < 100 ? ' (under)' : ' (over)'}
            </span>
          )}
        </div>
        {total === 100 && (
          <div className="total-valid">✓ Balanced</div>
        )}
      </div>
    </div>
  );
};

export default WeightControls;