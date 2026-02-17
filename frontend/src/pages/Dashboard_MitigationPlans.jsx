import React, { useState, useEffect } from 'react';
import InterventionCatalog from "../components/planner/Mitigations/InterventionCatalog";
import PlanBuilder from "../components/planner/Mitigations/PlanBuilder";
import PlansList from "../components/planner/Mitigations/PlansList";
import PlanDetailModal from "../components/planner/Mitigations/PlanDetailModal";
import { interventionsData } from "../components/planner/PlannerData/mitigationsData";
import "../components/planner/MitigationTab.css";

const MitigationTab = () => {
    const [activeTab, setActiveTab] = useState('catalog');
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [interventions, setInterventions] = useState(interventionsData);

    //load saved plans from localStorage
    useEffect(() => {
        const savedPlans = localStorage.getItem('noiseMitigationPlans');
        if (savedPlans) {
            try {
                setPlans(JSON.parse(savedPlans));
            } catch (error) {
                console.error('Error loading plans from localStorage:', error);
                setPlans([]);
            }
        }
    }, []);

    //Save plans to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('noiseMitigationPlans', JSON.stringify(plans));
    }, [plans]);

    const handleAddToPlan = (intervention) => {

        alert(`Added ${intervention.name} to plan. Switch to "Build Plan" tab to continue.`);
        localStorage.setItem('lastSelectedIntervention', JSON.stringify(intervention));
    };

    const handleCreatePlan = (newPlan) => {
        const planWithId = {
            ...newPlan,
            id: `plan-${Date.now()}`,
            status: 'draft'
        };
        setPlans([...plans, planWithId]);
        setActiveTab('plans');
    };

    const handleUpdatePlanStatus = (planId, newStatus) => {
        setPlans(plans.map(plan => 
            plan.id === planId ? { ...plan, status: newStatus } : plan
        ));
    };

    const handleDeletePlan = (planId) => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            setPlans(plans.filter(plan => plan.id !== planId));
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
                    onUpdateStatus={handleUpdatePlanStatus}
                    onDeletePlan={handleDeletePlan}
                />;
            default:
                return <InterventionCatalog onAddToPlan={handleAddToPlan} />;
        }
    };

    return (
        <div className="mitigation-tab">
            <div className="tab-header">
                <h1>Noise Mitigation Planner</h1>
                <p className="tab-description">
                    Design and manage noise reduction strategies for different zones
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
                    plan={selectedPlan}
                    onClose={handleCloseModal}
                    onUpdateStatus={handleUpdatePlanStatus}
                />
            )}
        </div>
    );
};

export default MitigationTab;