    import React, { useState } from 'react';
import './InterventionCatalog.css';
import { interventionsData } from '../PlannerData/mitigationsData';

const InterventionCatalog = ({ onAddToPlan }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCost, setSelectedCost] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['all', 'awareness', 'regulatory', 'physical', 'education', 'technical', 'environmental'];
    const costBands = ['all', 'low', 'medium', 'high'];

    const filteredInterventions = interventionsData.filter(intervention => {
        const matchesCategory = selectedCategory === 'all' || intervention.category === selectedCategory;
        const matchesCost = selectedCost === 'all' || intervention.costBand === selectedCost;
        const matchesSearch = intervention.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             intervention.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesCategory && matchesCost && matchesSearch;
    });

    const getCostColor = (costBand) => {
        switch(costBand) {
            case 'low': return '#10b981';
            case 'medium': return '#f59e0b';
            case 'high': return '#ef4444';
            default: return '#64748b';
        }
    };

    const getFeasibilityColor = (feasibility) => {
        if (feasibility >= 0.8) return '#10b981';
        if (feasibility >= 0.6) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="intervention-catalog">
            <div className="catalog-header">
                <h2>Intervention Catalog</h2>
                <p>Browse available interventions for noise mitigation</p>
            </div>

            <div className="catalog-filters">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search interventions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-row">
                    <div className="filter-group">
                        <label className="filter-label">Category</label>
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="filter-select"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Cost Band</label>
                        <select 
                            value={selectedCost}
                            onChange={(e) => setSelectedCost(e.target.value)}
                            className="filter-select"
                        >
                            {costBands.map(cost => (
                                <option key={cost} value={cost}>
                                    {cost.charAt(0).toUpperCase() + cost.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="interventions-grid">
                {filteredInterventions.map(intervention => (
                    <div key={intervention.id} className="intervention-card">
                        <div className="intervention-header">
                            <h3 className="intervention-name">{intervention.name}</h3>
                            <div className="intervention-category">
                                {intervention.category}
                            </div>
                        </div>

                        <p className="intervention-description">{intervention.description}</p>

                        <div className="intervention-details">
                            <div className="detail-item">
                                <span className="detail-label">Cost:</span>
                                <span 
                                    className="detail-value"
                                    style={{ color: getCostColor(intervention.costBand) }}
                                >
                                    {intervention.costBand.toUpperCase()} 
                                    (£{intervention.costRange.min}-£{intervention.costRange.max})
                                </span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Impact:</span>
                                <span className="detail-value">
                                    {intervention.impactRange.min}-{intervention.impactRange.max} dB reduction
                                </span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Feasibility:</span>
                                <span 
                                    className="detail-value"
                                    style={{ color: getFeasibilityColor(intervention.feasibility) }}
                                >
                                    {Math.round(intervention.feasibility * 100)}%
                                </span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Time:</span>
                                <span className="detail-value">{intervention.implementationTime}</span>
                            </div>
                        </div>

                        <button 
                            className="add-to-plan-button"
                            onClick={() => onAddToPlan(intervention)}
                        >
                            Add to Plan
                        </button>
                    </div>
                ))}
            </div>

            {filteredInterventions.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <h3>No interventions found</h3>
                    <p>Try adjusting your filters or search term</p>
                </div>
            )}
        </div>
    );
};

export default InterventionCatalog;