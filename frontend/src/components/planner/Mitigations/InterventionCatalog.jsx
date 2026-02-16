import React, { useState, useEffect } from 'react';
import './InterventionCatalog.css';
import { interventionServerService,interventionLocalService } from '../../services/interventionService';
import InterventionBuilderModal from './InterventionBuilderModal';

const InterventionCatalog = ({ onAddToPlan }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCost, setSelectedCost] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedIntervention, setSelectedIntervention] = useState(null);

    const categories = ['all', 'awareness', 'regulatory', 'physical', 'education', 'technical', 'environmental'];
    const costBands = ['all', 'low', 'medium', 'high'];

    useEffect(() => {
        const loadInterventions = async () => {
            try {
                const freshData = await interventionServerService.getAll();
                setInterventions(freshData);
                interventionLocalService.saveAll(freshData);
            } catch (error) {
                console.log('Server fetch failed, loading from cache');
                const cached = localStorage.getItem('interventions');
                if (cached) {
                    setInterventions(JSON.parse(cached));
                }
            } finally {
                setLoading(false);
            }
        };
        
        loadInterventions();
    }, []);

    const handleCreate = async (newIntervention) => {
        try {
            interventionServerService.create(completeIntervention).catch(error => {
            console.log('Server create call failed ');
        });
            setInterventions(prev => [...prev, newIntervention]);
            interventionLocalService.create(newIntervention);
        } catch (error) {
            console.log('Server create failed, using local');
            setInterventions(prev => [...prev, newIntervention]);
            interventionLocalService.create(newIntervention);
        }
    };

    const handleUpdate = async (updatedIntervention) => {
        try {
        interventionServerService.update(completeIntervention).catch(error => {
            console.log('Server update failed ');

        })
           setInterventions(prev => [...prev, updatedIntervention]);
        interventionLocalService.update(serverResponse);
        } catch (error) {
            console.log('Server update failed, using local');
            setInterventions(prev => 
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
            interventionServerService.delete(id);
            setInterventions(prev => prev.filter(i => i.id !== id));
            interventionLocalService.delete(id);
        } catch (error) {
            console.log('Server delete failed, fall back to local');
            setInterventions(prev => prev.filter(i => i.id !== id));
            interventionLocalService.delete(id);
        }
    };

    //modal handler functions
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
        const matchesCost = selectedCost === 'all' || intervention.costBand === selectedCost;
        const matchesSearch = intervention.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             intervention.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
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
                <button 
                    onClick={handleCreateNewClick}

                >
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
                                    style={{ color: getCostColor(intervention.costBand) }}
                                >
                                    {intervention.costBand?.toUpperCase()} 
                                    (£{intervention.costRange?.min}-£{intervention.costRange?.max})
                                </span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Impact:</span>
                                <span className="detail-value">
                                    {intervention.impactRange?.min}-{intervention.impactRange?.max} dB reduction
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

                        <div className="card-actions">
                            {/*Add edit button */}
                            <button 
                                className="add-to-plan-button"
                                onClick={() => onAddToPlan(intervention)}
                            >
                                Add to Plan
                            </button>
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