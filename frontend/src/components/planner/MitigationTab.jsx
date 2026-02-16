import React, { useState, useEffect } from 'react';
import InterventionCatalog from './Mitigations/InterventionCatalog';
import PlanBuilder from './Mitigations/PlanBuilder';
import PlansList from './Mitigations/PlansList';
import PlanDetailModal from './Mitigations/PlanDetailModal';
import { interventionsData } from './PlannerData/mitigationsData';
import { planServerService,planLocalService  } from '../services/planService';
import { interventionLocalService } from '../services/interventionService';
import './MitigationTab.css';

const MitigationTab = () => {
    const [activeTab, setActiveTab] = useState('catalog');
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);

    //load interventions from local storage 
    useEffect(() => {
        const loadInterventions = () => {
            const localInterventions = interventionLocalService.getAll();
            if (localInterventions && localInterventions.length > 0) {
                setInterventions(localInterventions);
            } else {
                // Seed local storage with imported data if empty
                setInterventions(interventionsData);
                interventionLocalService.saveAll(interventionsData);
            }
        };

        loadInterventions();
    }, []);

    //Load plans from server
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

    const handleCreatePlan = async (newPlan) => {
        const planWithId = {
            ...newPlan,
            id: `plan-${Date.now()}`,
            status: 'draft',
            created_at: new Date().toISOString()
        };
        
        try {
            const serverResponse = await planServerService.create(planWithId);
            setPlans(prevPlans => [...prevPlans, serverResponse]);
            planLocalService.create(serverResponse);
            setActiveTab('plans');
            return serverResponse;
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
            const serverResponse = await planServerService.update(updatedPlan);
            setPlans(prevPlans => 
                prevPlans.map(plan => 
                    plan.id === updatedPlan.id ? serverResponse : plan
                )
            );
            planLocalService.update(serverResponse);
            
            if (selectedPlan && selectedPlan.id === updatedPlan.id) {
                setSelectedPlan(serverResponse);
            }
            return serverResponse;
        } catch (error) {
            console.error('Failed to update plan on server:', error);
            setPlans(prevPlans => 
                prevPlans.map(plan => 
                    plan.id === updatedPlan.id ? updatedPlan : plan
                )
            );
            planLocalService.update(updatedPlan);
            throw error;
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
                return <InterventionCatalog interventions={interventions} />;
            case 'builder':
                return <PlanBuilder 
                    interventions={interventions} 
                    onCreatePlan={handleCreatePlan}
 
                />;
            case 'plans':
                return <PlansList 
                    plans={plans} 
                    onViewPlan={handleViewPlanDetails}
                    onDeletePlan={handleDeletePlan}
                    onUpdatePlan={handleUpdatePlan}
                />;
            default:
                return <InterventionCatalog interventions={interventions} />;
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