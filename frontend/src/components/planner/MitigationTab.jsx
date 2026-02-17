import React, { useState, useEffect } from 'react';
import InterventionCatalog from './Mitigations/InterventionCatalog';
import PlanBuilder from './Mitigations/PlanBuilder';
import PlansList from './Mitigations/PlansList';
import PlanDetailModal from './Mitigations/PlanDetailModal';
// Remove this line - don't import hardcoded data
// import { interventionsData } from './PlannerData/mitigationsData';
import { planServerService, planLocalService } from '../services/planService';
import { interventionServerService, interventionLocalService } from '../services/interventionService';
import './MitigationTab.css';

const MitigationTab = () => {
    const [activeTab, setActiveTab] = useState('catalog');
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInterventions = async () => {
            try {
                const serverInterventions = await interventionServerService.getAll();
                
                if (serverInterventions && serverInterventions.length > 0) {
                    setInterventions(serverInterventions);
                    interventionLocalService.saveAll(serverInterventions);
                } else {
                    const localInterventions = interventionLocalService.getAll();
                    if (localInterventions && localInterventions.length > 0) {
                        setInterventions(localInterventions);
                    } else {
                        setInterventions([]);
                    }
                }
            } catch (error) {
                console.error('Failed to load interventions from server:', error);
                const localInterventions = interventionLocalService.getAll();
                setInterventions(localInterventions || []);
            }
        };

        loadInterventions();
    }, []);

    useEffect(() => {
        const loadPlans = async () => {
            try {
                setLoading(true);
                const serverPlans = await planServerService.getAll();
                
                if (serverPlans && serverPlans.length > 0) {
                    setPlans(serverPlans);
                    planLocalService.saveAll(serverPlans);
                } else {
                    setPlans([]);
                }
            } catch (error) {
                console.error('Failed to load plans from server:', error);
                setPlans([]);
            } finally {
                setLoading(false);
            }
        };

        loadPlans();
    }, []);

    const handleCreateIntervention = async (newIntervention) => {
        const interventionWithId = {
            ...newIntervention,
            id: newIntervention.id || `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString()
        };
        
        try {
            await interventionServerService.create(interventionWithId);
            setInterventions(prev => [...prev, interventionWithId]);
            interventionLocalService.create(interventionWithId);
        } catch (error) {
            console.log('Failed to create intervention on server:', error);
            setInterventions(prev => [...prev, interventionWithId]);
            interventionLocalService.create(interventionWithId);
        }
    };

    const handleUpdateIntervention = async (updatedIntervention) => {
        try {
            await interventionServerService.update(updatedIntervention);
            
            setInterventions(prev => 
                prev.map(i => i.id === updatedIntervention.id ? updatedIntervention : i)
            );
            interventionLocalService.update(updatedIntervention);
        } catch (error) {
            console.log('Failed to update intervention on server:', error);
            setInterventions(prev => 
                prev.map(i => i.id === updatedIntervention.id ? updatedIntervention : i)
            );
            interventionLocalService.update(updatedIntervention);
        }
    };

    const handleDeleteIntervention = async (id) => {
        if (interventions.length <= 1) {
            alert('Cannot delete: At least one intervention required');
            return;
        }
        
        try {
            await interventionServerService.delete(id);
            setInterventions(prev => prev.filter(i => i.id !== id));
            interventionLocalService.delete(id);
        } catch (error) {
            console.log('Failed to delete intervention from server:', error);
            setInterventions(prev => prev.filter(i => i.id !== id));
            interventionLocalService.delete(id);
        }
    };

    const handleCreatePlan = async (newPlan) => {
        let newId;
        let isUnique = false;

        while (!isUnique) {
            newId = Math.floor(Math.random() * 999999) + 1;
            isUnique = !plans.some(plan => plan.id === newId.toString());
        }
        
        const planWithId = {
            ...newPlan,
            id: `${newId}`,
            status: 'draft',
            created_at: new Date().toISOString()
        };
        
        try {
            await planServerService.create(planWithId);
            setPlans(prevPlans => [...prevPlans, planWithId]);
            planLocalService.create(planWithId);
            setActiveTab('plans');
        } catch (error) {
            console.log('Failed to create plan on server:', error);
            setPlans(prevPlans => [...prevPlans, planWithId]);
            planLocalService.create(planWithId);
            setActiveTab('plans');
            throw error;
        }
    };

    const handleUpdatePlan = async (updatedPlan) => {
        try {
            planServerService.update(updatedPlan).catch(error => {
                console.log('Server update failed (background):', error);
            });
            
            setPlans(prevPlans => {
                const currentPlans = Array.isArray(prevPlans) ? prevPlans : [];
                return currentPlans.map(plan => 
                    plan && plan.id === updatedPlan.id ? updatedPlan : plan
                );
            });
            
            planLocalService.update(updatedPlan);
            
            if (selectedPlan && selectedPlan.id === updatedPlan.id) {
                setSelectedPlan(updatedPlan);
            }
        } catch (error) {
            console.log('Failed to update plan:', error);
            
            setPlans(prevPlans => {
                const currentPlans = Array.isArray(prevPlans) ? prevPlans : [];
                return currentPlans.map(plan => 
                    plan && plan.id === updatedPlan.id ? updatedPlan : plan
                );
            });
            planLocalService.update(updatedPlan);
        }
    };

    const handleDeletePlan = async (planId) => {
        try {
            await planServerService.delete(planId);
            setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
            planLocalService.delete(planId);
            
            if (selectedPlan && selectedPlan.id === planId) {
                setSelectedPlan(null);
            }
        } catch (error) {
            console.error('Failed to delete plan from server:', error);
            setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
            planLocalService.delete(planId);
            throw error;
        }
    };

    const handleViewPlanDetails = (plan) => {
        setSelectedPlan(plan);
    };

    const handleCloseModal = () => {
        setSelectedPlan(null);
    };

    const getStatusCount = (status) => {
        return plans.filter(plan => plan.status === status).length;
    };
    
    const renderActiveTab = () => {
        switch(activeTab) {
            case 'catalog':
                return (
                    <InterventionCatalog 
                        interventions={interventions}
                        onCreateIntervention={handleCreateIntervention}
                        onUpdateIntervention={handleUpdateIntervention}
                        onDeleteIntervention={handleDeleteIntervention}
                        onAddToPlan={(intervention) => {
   
                        }}
                    />
                );
            case 'builder':
                return (
                    <PlanBuilder 
                        interventions={interventions} 
                        onCreatePlan={handleCreatePlan}
                    />
                );
            case 'plans':
                return (
                    <PlansList 
                        plans={plans} 
                        onViewPlan={handleViewPlanDetails}
                        onDeletePlan={handleDeletePlan}
                        onUpdatePlan={handleUpdatePlan}
                    />
                );
            default:
                return (
                    <InterventionCatalog 
                        interventions={interventions}
                        onCreateIntervention={handleCreateIntervention}
                        onUpdateIntervention={handleUpdateIntervention}
                        onDeleteIntervention={handleDeleteIntervention}
                    />
                );
        }
    };

    if (loading) {
        return <div className="loading">Loading plans...</div>;
    }

    return (
        <div className="mitigation-tab">
            <div className="tab-header">
                <h1>Noise Interventions/Mitigations Creator</h1>
                <p className="tab-description">
                    Create, manage and track implementations of plans for noise interventions
                </p>
            </div>

            <div className="tab-navigation">
                <button 
                    className={`tab-button ${activeTab === 'catalog' ? 'active' : ''}`}
                    onClick={() => setActiveTab('catalog')}
                >
                    <span className="tab-icon">📚</span>
                    <span className="tab-label">Catalog</span>
                    <span className="tab-count">{interventions.length}</span>
                </button>
                
                <button 
                    className={`tab-button ${activeTab === 'builder' ? 'active' : ''}`}
                    onClick={() => setActiveTab('builder')}
                >
                    <span className="tab-icon">🛠️</span>
                    <span className="tab-label">Build Plan</span>
                </button>
                
                <button 
                    className={`tab-button ${activeTab === 'plans' ? 'active' : ''}`}
                    onClick={() => setActiveTab('plans')}
                >
                    <span className="tab-icon">📋</span>
                    <span className="tab-label">My Plans</span>
                    <span className="tab-count">{plans.length}</span>
                </button>
                
                <div className="tab-status-indicators">
                    <span className="status-indicator draft">
                        <span className="status-dot"></span>
                        Draft: {getStatusCount('draft')}
                    </span>
                    <span className="status-indicator submitted">
                        <span className="status-dot"></span>
                        Submitted: {getStatusCount('submitted')}
                    </span>
                    <span className="status-indicator implemented">
                        <span className="status-dot"></span>
                        Implemented: {getStatusCount('implemented')}
                    </span>
                </div>
            </div>

            <div className="tab-content">
                {renderActiveTab()}
            </div>

            {selectedPlan && (
                <PlanDetailModal 
                    isOpen={true}
                    onClose={handleCloseModal}
                    plan={selectedPlan}
                    onUpdatePlan={handleUpdatePlan}
                />
            )}
        </div>
    );
};

export default MitigationTab;