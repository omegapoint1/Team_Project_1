import ReactModal from 'react-modal';
import { useState, useEffect } from 'react';
import './PlanDetailModal.css';
import EvidenceUploader from '../../common/EvidenceUploader.jsx';
import EvidenceDisplay from '../../common/DisplayEvidence.jsx';
import PlanExportButtons from '../../common/PlanExportButtons.jsx';

ReactModal.setAppElement('#root');

const PlanDetailModal = ({ isOpen, onClose, plan, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(plan?.name || '');
    const [attachedEvidence, setAttachedEvidence] = useState([]);
    const [planNotes, setPlanNotes] = useState('');

    useEffect(() => {
        if (plan) {
            setEditedName(plan.name || '');
            setAttachedEvidence(plan.evidence || []);
            setPlanNotes(plan.notes || '');
        }
    }, [plan]);

    if (!plan) return null;

    const formatImpact = (impact) => {
        if (impact === undefined || impact === null) return '0 dB';
        if (typeof impact === 'number') return `${impact} dB`;
        if (Array.isArray(impact)) return `${impact[0] || 0}-${impact[1] || 0} dB`;
        if (impact.min !== undefined) return `${impact.min}-${impact.max} dB`;
        return '0 dB';
    };

    const formatCost = (cost) => {
        if (cost === undefined || cost === null) return '£0';
        if (typeof cost === 'number') return `£${cost}`;
        if (Array.isArray(cost)) return `£${cost[0] || 0}-£${cost[1] || 0}`;
        if (cost.min !== undefined) return `£${cost.min}-£${cost.max}`;
        return '£0';
    };

    const modalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            borderRadius: '16px',
            padding: '0',
            border: 'none',
            boxShadow: '0 25px 50px -12px black',
            overflow: 'hidden',
            zIndex: 1001
        },
        overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }
    };

    const getNextStatusOptions = () => {
        switch(plan.status) {
            case 'Planned': 
                return [{ value: 'In Progress', label: 'Mark as Processed', color: '#2196f3', description: 'Action is currently in process for this plan' }];
            case 'In Progress': 
                return [
                    { value: 'Done', label: 'Mark as Completed', color: '#9c27b0', description: 'Plan has been executed to completion' },
                    { value: 'Rejected/Cancelled', label: 'Rejected as Invalid', color: '#f44336', description: 'Rejected report - duplicate or invalid for other reason' }
                ];
            case 'Done': 
                return [{ value: 'In Progress', label: 'Re-open Implementation', color: '#2196f3', description: 'Re-open for additional work' }];
            case 'Rejected/Cancelled': 
                return [{ value: 'Planned', label: 'Validate Incident', color: '#4caf50', description: 'Accepted as genuine' }];
            default: 
                return [];
        }
    };

    const handleStatusUpdate = (newStatus) => {
        const updatedPlan = {
            ...plan,
            status: newStatus,
        };
        onUpdate(updatedPlan);
    };

    const handleNameUpdate = () => {
        if (editedName !== plan.name) {
            const updatedPlan = {
                ...plan,
                name: editedName,
            };
            onUpdate(updatedPlan);
        }
        setIsEditingName(false);
    };

    const handleNotesUpdate = () => {
        const updatedPlan = {
            ...plan,
            notes: planNotes,
        };
        onUpdate(updatedPlan);
    };

    const calculateBudgetUtilization = () => {
        const totalCost = plan.totalCost || 0;
        const budget = plan.budget || 1;
        return Math.min(Math.round((totalCost / budget) * 100), 100);
    };

    const getBudgetStatus = () => {
        const utilization = calculateBudgetUtilization();
        if (utilization > 100) return { color: '#f44336', label: 'Over Budget' };
        if (utilization > 90) return { color: '#ff9800', label: 'Near Limit' };
        return { color: '#4caf50', label: 'Within Budget' };
    };

    const handleEvidenceUploaded = (evidenceItems) => {
        const newEvidence = [...attachedEvidence, ...evidenceItems];
        setAttachedEvidence(newEvidence);

        const updatedPlan = {
            ...plan,
            evidence: newEvidence,
        };
        onUpdate(updatedPlan);
    };

    const handleEvidenceRemoval = (evidenceId) => {
        const filteredEvidence = attachedEvidence.filter(item => item.id !== evidenceId);
        setAttachedEvidence(filteredEvidence);

        const updatedPlan = {
            ...plan,
            evidence: filteredEvidence,
        };
        onUpdate(updatedPlan);
    };

    const renderOverview = () => (
        <div className="overview-section">
            <div className="overview-grid">
                <div className="overview-card">
                    <h4>Budget Summary</h4>
                    <div className="budget-summary">
                        <div className="budget-item">
                            <span>Total Budget</span>
                            <span>£{plan.budget || 0}</span>
                        </div>
                        <div className="budget-item">
                            <span>Plan Cost</span>
                            <span>£{plan.totalCost || 0}</span>
                        </div>
                        <div className="budget-item">
                            <span>Remaining</span>
                            <span style={{ color: (plan.budget || 0) - (plan.totalCost || 0) >= 0 ? '#4caf50' : '#f44336' }}>
                                £{((plan.budget || 0) - (plan.totalCost || 0))}
                            </span>
                        </div>
                    </div>
                    <div className="budget-meter-modal">
                        <div className="meter-header-modal">
                            <span>Budget Utilization</span>
                            <span>{calculateBudgetUtilization()}%</span>
                        </div>
                        <div className="meter-bar-modal">
                            <div 
                                className="meter-fill-modal"
                                style={{ 
                                    width: `${calculateBudgetUtilization()}%`,
                                    backgroundColor: getBudgetStatus().color
                                }}
                            />
                        </div>
                        <div className="meter-status" style={{ color: getBudgetStatus().color }}>
                            {getBudgetStatus().label}
                        </div>
                    </div>
                </div>

                <div className="overview-card">
                    <h4>Timeline & Impact</h4>
                    <div className="timeline-impact">
                        <div className="timeline-info">
                            <div>Implementation Timeline</div>
                            <div>
                                <span>{plan.timeline || 0} weeks</span>
                                <span>
                                    {(plan.timeline || 0) <= 4 ? 'Fast' : (plan.timeline || 0) <= 8 ? 'Medium' : 'Long'}
                                </span>
                            </div>
                        </div>
                        <div className="impact-info">
                            <div>Estimated Noise Reduction</div>
                            <div>
                                {formatImpact(plan.impact)}
                            </div>
                            <div>
                                Expected reduction in noise levels after implementation
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overview-card full-width">
                    <h4>Zone Information</h4>
                    <div className="zone-details">
                        <div className="zone-info">
                            <span>Target Zone</span>
                            <span>{plan.zone}</span>
                        </div>
                        <div className="zone-info">
                            <span>Plan Created</span>
                            <span>
                                {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : 'N/A'}
                            </span>
                        </div>
                        <div className="zone-info">
                            <span>Last Updated</span>
                            <span>
                                {plan.updatedAt ? new Date(plan.updatedAt).toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : new Date(plan.createdAt).toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderInterventions = () => (
        <div className="interventions-section">
            <div className="interventions-header">
                <h4>Comprised Interventions</h4>
                <div className="interventions-info">
                    <span>Total Cost: £{plan.totalCost || 0}</span>
                    <span>Total Impact: {formatImpact(plan.impact)}</span>
                </div>
            </div>
            
            <div className="interventions-list">
                {plan.interventions && plan.interventions.map((intervention, index) => (
                    <div key={index} className="intervention-detail">
                        <div className="intervention-header-detail">
                            <h5>{intervention.name}</h5>
                            <span>{intervention.category}</span>
                        </div>
                        
                        <p>{intervention.description}</p>
                        
                        <div className="intervention-stats-detail">
                            <div className="stat-box">
                                <span>Cost Range</span>
                                <span>
                                    {formatCost(intervention.cost)}
                                </span>
                            </div>
                            <div className="stat-box">
                                <span>Impact Range</span>
                                <span>
                                    {formatImpact(intervention.impact)}
                                </span>
                            </div>
                            <div className="stat-box">
                                <span>Feasibility</span>
                                <span>
                                    {Math.round((intervention.feasibility || 0) * 100)}%
                                </span>
                            </div>
                            <div className="stat-box">
                                <span>Time Required</span>
                                <span>{intervention.implementationTime || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderActions = () => (
        <div className="actions-section">
            <div className="status-actions">
                <h4>Update Plan Status</h4>
                <p>
                    Current Status: 
                    <span className="status-badge-modal">
                        {plan.status}
                    </span>
                </p>
                <div className="export-actions">
                    <h4>Export Plan</h4>
                    <PlanExportButtons plan={plan} />
                </div>
                
                <div className="action-buttons">
                    {getNextStatusOptions().map(option => (
                        <button
                            key={option.value}
                            onClick={() => handleStatusUpdate(option.value)}
                            style={{ backgroundColor: option.color }}
                            title={option.description}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="evidence-actions">
                <h4>Attach Evidence & Documentation</h4>
                <EvidenceDisplay 
                    evidence={attachedEvidence}
                    onRemoveEvidence={handleEvidenceRemoval}
                />
                <EvidenceUploader 
                    onEvidenceUploaded={handleEvidenceUploaded}
                    attachedEvidence={attachedEvidence}
                    onRemoveEvidence={handleEvidenceRemoval}
                    planId={plan.id}
                />
            </div>

            <div className="plan-notes">
                <h4>Notes & Comments</h4>
                <textarea
                    placeholder="Add notes or comments about this plan..."
                    rows={4}
                    value={planNotes}
                    onChange={(e) => setPlanNotes(e.target.value)}
                />
                <button onClick={handleNotesUpdate}>Save Notes</button>
            </div>
        </div>
    );

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={modalStyles}
            ariaHideApp={false}
        >
            <div className="modal-content">
                <div className="modal-header">
                    <div className="modal-title-section">
                        {isEditingName ? (
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                onBlur={handleNameUpdate}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleNameUpdate();
                                }}
                                autoFocus
                            />
                        ) : (
                            <h2 
                                onDoubleClick={() => setIsEditingName(true)}
                                title="Double click to edit"
                            >
                                {plan.name}
                            </h2>
                        )}
                        <div className="modal-subtitle">
                            <span>ID: {plan.id}</span>
                            <span>
                                Created: {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : 'N/A'}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="close-modal-btn">×</button>
                </div>

                <div className="modal-tabs">
                    <button 
                        className={activeTab === 'overview' ? 'active' : ''}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Overview
                    </button>
                    <button 
                        className={activeTab === 'interventions' ? 'active' : ''}
                        onClick={() => setActiveTab('interventions')}
                    >
                        🛠️ Interventions ({plan.interventions?.length || 0})
                    </button>
                    <button 
                        className={activeTab === 'actions' ? 'active' : ''}
                        onClick={() => setActiveTab('actions')}
                    >
                        ⚡ Actions
                    </button>
                </div>

                <div className="modal-body">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'interventions' && renderInterventions()}
                    {activeTab === 'actions' && renderActions()}
                </div>

                <div className="modal-footer">
                    <div>
                        <span>
                            Last updated: {plan.updatedAt ? new Date(plan.updatedAt).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : new Date(plan.createdAt).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                    <div>
                        <button onClick={onClose} className="close-footer-btn">Close</button>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
};

export default PlanDetailModal;