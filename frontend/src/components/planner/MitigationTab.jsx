import React, { useState, useEffect } from 'react';
import InterventionCatalog from './Mitigations/InterventionCatalog';
import PlanBuilder from './Mitigations/PlanBuilder';
import PlansList from './Mitigations/PlansList';
import PlanDetailModal from './Mitigations/PlanDetailModal';
import { interventionsData } from './PlannerData/mitigationsData';
import { planLocalService,planServerService } from '../services/planService';
import './MitigationTab.css';

const MitigationTab = () => {
    const [activeTab, setActiveTab] = useState('catalog');
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [interventions, setInterventions] = useState(interventionsData);
    const [loading, setLoading] = useState(true);

    //Load saved plans from local storageon mount
  useEffect(() => {
        const loadPlans = async () => {

            
            try {
                const serverPlans = await planServerService.getAll();
                
                if (serverPlans && serverPlans.length > 0) {
                    setPlans(serverPlans);
                    planLocalService.saveAll(serverPlans);
                    console.log('Loaded plans from server:', serverPlans.length);
                } else {
                    //fallback to local storage
                    const localPlans = planLocalService.getAll();
                    
                    if (localPlans && localPlans.length > 0) {
                        setPlans(localPlans);
                        
                    } else {
                        setPlans([]);
                    }
                }
            } catch (error) {
                console.error('Error loading from server, falling back to localStorage');
                
                // Fallback to local storage on server error
                const localPlans = planLocalService.getAll();
                setPlans(localPlans);
            } finally {
                setLoading(false);
            }
        };

        loadPlans();
    }, []);
    // Save plans to local storage whenever they change
    useEffect(() => {
        
        if (plans.length > 0) {
            try {
                const plansStrings = JSON.stringify(plans);
                localStorage.setItem('noiseMitigationPlans', plansStrings);
                
            } catch (error) {
                console.error('Error saving to local storage');
            }
        }
  
    }, [plans]);

    const handleAddToPlan = (intervention) => {
        localStorage.setItem('lastSelectedIntervention', JSON.stringify(intervention));
    };
    

    const handleCreatePlan = async (newPlan) => {
        
        const planWithId = {
            ...newPlan,
            id: `plan-${Date.now()}`,
            status: 'Planned',
            createdAt: new Date().toISOString(),
        };
        
        
        setPlans(prevPlans => {
            const updatedPlans = [...prevPlans, planWithId];
            console.log('Updated plans array:', updatedPlans);
            return updatedPlans;
        });
        try {
            await planServerService.addPlan(planWithId);
        } catch (error) {
            console.error('Failed to sync new plan to server:', error);
        }
        setActiveTab('plans');
    };

    const handleUpdatePlan =  async(updatedPlan) => {
        setPlans(prevPlans => {
        const updatedPlans = prevPlans.map(plan => 
            plan.id === updatedPlan.id ? updatedPlan : plan
        );
        //console.log('Plan updated:', updatedPlan);
        return updatedPlans;
    });
       try {
            await planServerService.update(updatedPlan.id, updatedPlan);
        } catch (error) {
            console.error('Failed to sync plan update to server:', error);
        }



};

    const handleDeletePlan = async (planId) => {
            setPlans(prevPlans => {
                const updatedPlans = prevPlans.filter(plan => plan.id !== planId);
                console.log('Updated plans after delete:', updatedPlans);
                return updatedPlans;
        })
        try {
        await planServerService.delete(planId);
        } catch (error) {
            console.error('Failed to sync plan deletion to server:', error);
        }
    };

    const handleViewPlanDetails = (plan) => {
        console.log('Viewing plan:', plan);
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
                return <InterventionCatalog onAddToPlan={handleAddToPlan} />;
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
                />;
            default:
                return <InterventionCatalog onAddToPlan={handleAddToPlan} />;
        }
    };

      return (
        <div className="mitigation-tab">
            <div className="tab-header">
                <h1>Noise Interventions/Mitigations creator</h1>
                <p className="tab-description">
                    Create manage and track implementations of plans for noise interventions
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
                    onUpdateStatus={handleUpdatePlan}
                />
            )}
        </div>
    );
};

export default MitigationTab;