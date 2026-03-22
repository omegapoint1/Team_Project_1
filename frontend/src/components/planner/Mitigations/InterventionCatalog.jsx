import React, { useState, useEffect } from 'react';
import './InterventionCatalog.css';
import { interventionServerService, interventionLocalService } from '../../services/interventionService';
import InterventionBuilderModal from './InterventionBuilderModal';

const InterventionCatalog = ({ 
  interventions: propInterventions,
  onUpdateIntervention,
  onCreateIntervention,
  onDeleteIntervention,
  onAddToPlan 
}) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCost, setSelectedCost] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [localInterventions, setLocalInterventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedIntervention, setSelectedIntervention] = useState(null);

    const interventions = propInterventions || localInterventions;

    const categories = ['all', 'physical', 'traffic', 'infrastructure', 'regulatory', 'building', 'green', 'enforcement', 'industrial', 'technology', 'transport', 'community'];
    const costBands = ['all', 'low', 'medium', 'high'];

    useEffect(() => {
        if (propInterventions && propInterventions.length > 0) {
            setLoading(false);
            return;
        }

        const loadInterventions = async () => {
            try {
                const freshData = await interventionServerService.getAll();
                setLocalInterventions(freshData);
                interventionLocalService.saveAll(freshData);
            } catch (error) {
                console.log('Server fetch failed, loading from cache');
                const cached = localStorage.getItem('interventions');
                if (cached) {
                    setLocalInterventions(JSON.parse(cached));
                }
            } finally {
                setLoading(false);
            }
        };
        
        loadInterventions();
    }, [propInterventions]);

    // Helper function to determine cost band from cost value
    const getCostBandFromCost = (cost) => {
        if (!cost) return 'medium';
        const avgCost = typeof cost === 'number' ? cost : (cost.min + cost.max) / 2;
        if (avgCost < 10000) return 'low';
        if (avgCost < 50000) return 'medium';
        return 'high';
    };

    // Helper function to format cost display
    const formatCost = (cost) => {
        if (!cost) return '£0';
        if (typeof cost === 'number') return `£${cost.toLocaleString()}`;
        if (Array.isArray(cost)) return `£${cost[0].toLocaleString()}-£${cost[1].toLocaleString()}`;
        if (cost.min !== undefined) return `£${cost.min.toLocaleString()}-£${cost.max.toLocaleString()}`;
        return '£0';
    };

    // Helper function to format impact display
    const formatImpact = (impact) => {
        if (!impact) return '0-0 dB';
        if (Array.isArray(impact)) return `${impact[0]}-${impact[1]} dB`;
        if (impact.min !== undefined) return `${impact.min}-${impact.max} dB`;
        if (typeof impact === 'number') return `${impact} dB`;
        return '0-0 dB';
    };

    // Helper function to format feasibility 
    const formatFeasibility = (feasibility) => {
        if (feasibility === undefined || feasibility === null) return '0%';
        if (typeof feasibility === 'number') {
            if (feasibility <= 1) {
                return `${Math.round(feasibility * 100)}%`;
            }
            return `${Math.round(feasibility)}%`;
        }
        return '0%';
    };

    const handleCreate = async (newIntervention) => {
        try {
            if (onCreateIntervention) {
                await onCreateIntervention(newIntervention);
            } else {
                interventionServerService.create(newIntervention).catch(error => {
                    console.log('Server create call failed');
                });
                setLocalInterventions(prev => [...prev, newIntervention]);
                interventionLocalService.create(newIntervention);
            }
        } catch (error) {
            console.log('Server create failed, using local');
            setLocalInterventions(prev => [...prev, newIntervention]);
            interventionLocalService.create(newIntervention);
        }
    };

    const handleUpdate = async (updatedIntervention) => {
        try {
            if (onUpdateIntervention) {
                await onUpdateIntervention(updatedIntervention);
            } else {
                interventionServerService.update(updatedIntervention).catch(error => {
                    console.log('Server update failed');
                });
                setLocalInterventions(prev => 
                    prev.map(i => i.id === updatedIntervention.id ? updatedIntervention : i)
                );
                interventionLocalService.update(updatedIntervention);
            }
        } catch (error) {
            console.log('Server update failed, using local');
            setLocalInterventions(prev => 
                prev.map(i => i.id === updatedIntervention.id ? updatedIntervention : i)
            );
            interventionLocalService.update(updatedIntervention);
        }
    };

    const handleDelete = async (id) => {
        if (interventions.length <= 16) {
            alert('Cannot delete: Minimum 16 interventions required');
            return;
        }

        try {
            if (onDeleteIntervention) {
                await onDeleteIntervention(id);
            } else {
                interventionServerService.delete(id);
                setLocalInterventions(prev => prev.filter(i => i.id !== id));
                interventionLocalService.delete(id);
            }
        } catch (error) {
            console.log('Server delete failed, fall back to local');
            setLocalInterventions(prev => prev.filter(i => i.id !== id));
            interventionLocalService.delete(id);
        }
    };

    const handleEditClick = (intervention) => {
        setSelectedIntervention(intervention);
        setModalOpen(true);
    };

    const handleCreateNewClick = () => {
        setSelectedIntervention(null);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedIntervention(null);
    };

    const filteredInterventions = interventions.filter(intervention => {
        const matchesCategory = selectedCategory === 'all' || intervention.category === selectedCategory;
        
        const costBand = getCostBandFromCost(intervention.cost || intervention.costRange);
        const matchesCost = selectedCost === 'all' || costBand === selectedCost;
        
        const matchesSearch = searchTerm === '' ||
                             intervention.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             intervention.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesCategory && matchesCost && matchesSearch;
    });

    const getCostColor = (cost) => {
        const costBand = getCostBandFromCost(cost);
        switch(costBand) {
            case 'low': return '#10b981';
            case 'medium': return '#f59e0b';
            case 'high': return '#ef4444';
            default: return '#64748b';
        }
    };

    const getFeasibilityColor = (feasibility) => {
        const value = typeof feasibility === 'number' ? (feasibility <= 1 ? feasibility : feasibility / 10) : 0.5;
        if (value >= 0.7) return '#10b981';
        if (value >= 0.4) return '#f59e0b';
        return '#ef4444';
    };

    if (loading) {
        return <div className="loading">Loading interventions..</div>;
    }

    return (
        <div className="intervention-catalog">
            <div className="catalog-header">
                <div>
                    <h2>Intervention Catalog</h2>
                    <p>Browse available interventions for noise mitigation</p>
                </div>
                <button onClick={handleCreateNewClick} className="create-button">
                    + New Intervention
                </button>
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
                                    style={{ color: getCostColor(intervention.cost || intervention.costRange) }}
                                >
                                    {formatCost(intervention.cost || intervention.costRange)}
                                </span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Impact:</span>
                                <span className="detail-value">
                                    {formatImpact(intervention.impact || intervention.impactRange)}
                                </span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Feasibility:</span>
                                <span 
                                    className="detail-value"
                                    style={{ color: getFeasibilityColor(intervention.feasibility) }}
                                >
                                    {formatFeasibility(intervention.feasibility)}
                                </span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Time:</span>
                                <span className="detail-value">{intervention.implementationTime || '3-6 months'}</span>
                            </div>

                            {intervention.tags && intervention.tags.length > 0 && (
                                <div className="detail-item tags">
                                    <span className="detail-label">Tags:</span>
                                    <div className="tag-list">
                                        {intervention.tags.map(tag => (
                                            <span key={tag} className="tag-badge">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="card-actions">
                            <button 
                                className="edit-button"
                                onClick={() => handleEditClick(intervention)}
                            >
                                Edit
                            </button>
                            {onAddToPlan && (
                                <button 
                                    className="add-to-plan-button"
                                    onClick={() => onAddToPlan(intervention)}
                                >
                                    Add to Plan
                                </button>
                            )}
                        </div>
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

            <InterventionBuilderModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                intervention={selectedIntervention}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                totalCount={interventions.length}
            />
        </div>
    );
};

export default InterventionCatalog;