import React, { useState } from 'react';
import './PlanBuilder.css';
import { zones } from '../PlannerData/mitigationsData';

const PlanBuilder = ({ interventions = [], onCreatePlan }) => {
    const [planName, setPlanName] = useState('');
    const [selectedZone, setSelectedZone] = useState('');
    const [selectedInterventions, setSelectedInterventions] = useState([]);
    const [budget, setBudget] = useState(5000);
    const [timeline, setTimeline] = useState(4);

    const handleAddIntervention = (intervention) => {
        if (!selectedInterventions.find(item => item.id === intervention.id)) {
            setSelectedInterventions([...selectedInterventions, intervention]);
        }
    };

    const handleRemoveIntervention = (interventionId) => {
        setSelectedInterventions(selectedInterventions.filter(item => item.id !== interventionId));
    };

    const calculateTotalCost = () => {
        return selectedInterventions.reduce((total, intervention) => {
            return total + (intervention.costRange.min + intervention.costRange.max) / 2;
        }, 0);
    };

    const calculateTotalImpact = () => {
        const minImpact = selectedInterventions.reduce((total, intervention) => 
            total + intervention.impactRange.min, 0
        );
        const maxImpact = selectedInterventions.reduce((total, intervention) => 
            total + intervention.impactRange.max, 0
        );
        return { min: minImpact, max: maxImpact };
    };

    const handleSubmit = () => {
        if (!planName || !selectedZone || selectedInterventions.length === 0) {
            alert('Please fill in all required fields and add at least one intervention');
            return;
        }

        const plan = {
            name: planName,
            zone: selectedZone,
            interventions: selectedInterventions,
            budget: budget,
            timeline: timeline,
            totalCost: calculateTotalCost(),
            impact: calculateTotalImpact(),
            status: 'draft',
            createdAt: new Date().toISOString()
        };

        onCreatePlan(plan);
        
        //reset form
        setPlanName('');
        setSelectedZone('');
        setSelectedInterventions([]);
        setBudget(5000);
        setTimeline(4);
        
        alert('Plan created successfully!');
    };

    const totalCost = calculateTotalCost();
    const totalImpact = calculateTotalImpact();

    return (
        <div className="plan-builder">
            <div className="builder-header">
                <h2>Create Mitigation Plan</h2>
                <p>Design a new noise mitigation strategy</p>
            </div>

            <div className="builder-form">
                <div className="form-section">
                    <h3>Basic Information</h3>
                    
                    <div className="form-group">
                        <label className="form-label">Plan Name *</label>
                        <input
                            type="text"
                            value={planName}
                            onChange={(e) => setPlanName(e.target.value)}
                            placeholder="e.g., Zone A Quiet Zone Implementation"
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Target Zone *</label>
                        <select
                            value={selectedZone}
                            onChange={(e) => setSelectedZone(e.target.value)}
                            className="form-select"
                        >
                            <option value="">Select a zone</option>
                            {zones.map(zone => (
                                <option key={zone.id} value={zone.id}>
                                    {zone.name} - {zone.type} ({zone.priority} priority)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Available Interventions</h3>
                    <div className="available-interventions">
                        {interventions.map(intervention => (
                            <div key={intervention.id} className="available-intervention">
                                <div className="available-intervention-info">
                                    <h4>{intervention.name}</h4>
                                    <p>{intervention.description}</p>
                                    <div className="intervention-stats">
                                        <span>Cost: £{intervention.costRange.min}-{intervention.costRange.max}</span>
                                        <span>Impact: {intervention.impactRange.min}-{intervention.impactRange.max} dB</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAddIntervention(intervention)}
                                    className="add-button"
                                    disabled={selectedInterventions.find(item => item.id === intervention.id)}
                                >
                                    {selectedInterventions.find(item => item.id === intervention.id) ? 'Added' : 'Add'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <h3>Selected Interventions ({selectedInterventions.length})</h3>
                    {selectedInterventions.length === 0 ? (
                        <p className="empty-selection">No interventions selected yet</p>
                    ) : (
                        <div className="selected-interventions">
                            {selectedInterventions.map(intervention => (
                                <div key={intervention.id} className="selected-intervention">
                                    <div className="selected-intervention-info">
                                        <h4>{intervention.name}</h4>
                                        <p>Cost: £{intervention.costRange.min}-{intervention.costRange.max}</p>
                                        <p>Impact: {intervention.impactRange.min}-{intervention.impactRange.max} dB</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveIntervention(intervention.id)}
                                        className="remove-button"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-section">
                    <h3>Plan Configuration</h3>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Budget (£)</label>
                            <input
                                type="range"
                                min="1000"
                                max="20000"
                                step="1000"
                                value={budget}
                                onChange={(e) => setBudget(parseInt(e.target.value))}
                                className="form-slider"
                            />
                            <div className="slider-value">£{budget}</div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Timeline (weeks)</label>
                            <input
                                type="range"
                                min="1"
                                max="12"
                                value={timeline}
                                onChange={(e) => setTimeline(parseInt(e.target.value))}
                                className="form-slider"
                            />
                            <div className="slider-value">{timeline} weeks</div>
                        </div>
                    </div>
                </div>

                <div className="plan-summary">
                    <h3>Plan Summary</h3>
                    <div className="summary-details">
                        <div className="summary-item">
                            <span className="summary-label">Total Cost:</span>
                            <span className="summary-value">£{Math.round(totalCost)}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Estimated Impact:</span>
                            <span className="summary-value">{totalImpact.min}-{totalImpact.max} dB reduction</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Interventions:</span>
                            <span className="summary-value">{selectedInterventions.length}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Budget Remaining:</span>
                            <span className="summary-value">£{Math.round(budget - totalCost)}</span>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button className="cancel-button">Cancel</button>
                    <button onClick={handleSubmit} className="submit-button">Create Plan</button>
                </div>
            </div>
        </div>
    );
};

export default PlanBuilder;