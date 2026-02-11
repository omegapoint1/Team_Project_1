import React, { useState, useEffect } from 'react';
import InterventionCatalog from './Mitigations/InterventionCatalog';
import PlanBuilder from './Mitigations/PlanBuilder';
import PlansList from './Mitigations/PlansList';
import PlanDetailModal from './Mitigations/PlanDetailModal';
import { interventionsData } from './PlannerData/mitigationsData';
import './MitigationTab.css';

const MitigationTab = () => {
    const [activeTab, setActiveTab] = useState('catalog');
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [interventions, setInterventions] = useState(interventionsData);

    // Load saved plans from localStorage
    useEffect(() => {
        const savedPlans = localStorage.getItem('noiseMitigationPlans');
        
        if (savedPlans) {
            try {
                const parsed = JSON.parse(savedPlans);
                setPlans(parsed);
            } catch (error) {
                console.error('Error loading plans from localStorage:', error);
                setPlans([]);
            }
        } else {
            console.log('No plans found in localStorage');
            setPlans([]);
        }
    }, []);

    // Save plans to localStorage whenever they change
    useEffect(() => {
        
        if (plans.length > 0) {
            try {
                const plansString = JSON.stringify(plans);
                localStorage.setItem('noiseMitigationPlans', plansString);
                
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
        }
  
    }, [plans]);

    const handleAddToPlan = (intervention) => {
        localStorage.setItem('lastSelectedIntervention', JSON.stringify(intervention));
    };

    const handleCreatePlan = (newPlan) => {
        
        const planWithId = {
            ...newPlan,
            id: `plan-${Date.now()}`,
            status: 'Planned',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        
        setPlans(prevPlans => {
            const updatedPlans = [...prevPlans, planWithId];
            console.log('Updated plans array:', updatedPlans);
            return updatedPlans;
        });
        
        setActiveTab('plans');
    };

    const handleUpdatePlanStatus = (planId, newStatus) => {
        
        setPlans(prevPlans => {
            const updatedPlans = prevPlans.map(plan => 
                plan.id === planId 
                    ? { ...plan, status: newStatus, updatedAt: new Date().toISOString() } 
                    : plan
            );
            console.log('Updated plans after status change:', updatedPlans);
            return updatedPlans;
        });
    };

    const handleDeletePlan = (planId) => {
            setPlans(prevPlans => {
                const updatedPlans = prevPlans.filter(plan => plan.id !== planId);
                console.log('Updated plans after delete:', updatedPlans);
                return updatedPlans;
        })
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
                    onUpdateStatus={handleUpdatePlanStatus}
                />
            )}
        </div>
    );
};

export default MitigationTab;