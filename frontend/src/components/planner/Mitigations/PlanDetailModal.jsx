import React, { useState } from 'react';
import './PlanDetailModal.css';

const PlanDetailModal = ({ plan, onClose, onUpdateStatus }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(plan.name);

    const statusOptions = {
        draft: { label: 'Draft', color: '#f59e0b', bgColor: '#fef3c7' },
        submitted: { label: 'Submitted', color: '#3b82f6', bgColor: '#dbeafe' },
        approved: { label: 'Approved', color: '#8b5cf6', bgColor: '#ede9fe' },
        implemented: { label: 'Implemented', color: '#10b981', bgColor: '#d1fae5' },
        rejected: { label: 'Rejected', color: '#ef4444', bgColor: '#fee2e2' }
    };

    const formatNumber = (amount) => {
        return new Intl.NumberFormat('en-GB').format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getNextStatusOptions = () => {
        switch(plan.status) {
            case 'draft':
                return [
                    { value: 'submitted', label: 'Submit for Review', color: '#3b82f6' }
                ];
            case 'submitted':
                return [
                    { value: 'approved', label: 'Approve Plan', color: '#8b5cf6' },
                    { value: 'rejected', label: 'Reject Plan', color: '#ef4444' }
                ];
            case 'approved':
                return [
                    { value: 'implemented', label: 'Mark as Implemented', color: '#10b981' }
                ];
            case 'rejected':
                return [
                    { value: 'draft', label: 'Return to Draft', color: '#f59e0b' }
                ];
            case 'implemented':
                return [
                    { value: 'submitted', label: 'Re-open for Review', color: '#3b82f6' }
                ];
            default:
                return [];
        }
    };

    const handleStatusUpdate = (newStatus) => {
        if (window.confirm(`Are you sure you want to change the status to "${statusOptions[newStatus].label}"?`)) {
            onUpdateStatus(plan.id, newStatus);
            onClose();
        }
    };

    const calculateBudgetUtilization = () => {
        return Math.min(Math.round((plan.totalCost / plan.budget) * 100), 100);
    };

    const getBudgetStatus = () => {
        const utilization = calculateBudgetUtilization();
        if (utilization > 100) return { color: '#ef4444', label: 'Over Budget' };
        if (utilization > 90) return { color: '#f59e0b', label: 'Near Limit' };
        return { color: '#10b981', label: 'Within Budget' };
    };

    const renderOverview = () => (
        <div className="overview-section">
            <div className="overview-grid">
                <div className="overview-card">
                    <h4>Budget Summary</h4>
                    <div className="budget-summary">
                        <div className="budget-item">
                            <span className="budget-label">Total Budget</span>
                            <span className="budget-value">£{formatNumber(plan.budget)}</span>
                        </div>
                        <div className="budget-item">
                            <span className="budget-label">Plan Cost</span>
                            <span className="budget-value">£{formatNumber(plan.totalCost)}</span>
                        </div>
                        <div className="budget-item">
                            <span className="budget-label">Remaining</span>
                            <span className="budget-value" style={{ 
                                color: plan.budget - plan.totalCost >= 0 ? '#10b981' : '#ef4444'
                            }}>
                                £{formatNumber(plan.budget - plan.totalCost)}
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
                            <div className="timeline-label">Implementation Timeline</div>
                            <div className="timeline-value">
                                <span className="timeline-weeks">{plan.timeline} weeks</span>
                                <span className="timeline-status">
                                    {plan.timeline <= 4 ? 'Fast' : plan.timeline <= 8 ? 'Medium' : 'Long'}
                                </span>
                            </div>
                        </div>
                        <div className="impact-info">
                            <div className="impact-label-modal">Estimated Noise Reduction</div>
                            <div className="impact-value-modal">
                                {plan.impact?.min || 0}-{plan.impact?.max || 0} dB
                            </div>
                            <div className="impact-description">
                                Expected reduction in noise levels after implementation
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overview-card full-width">
                    <h4>Zone Information</h4>
                    <div className="zone-details">
                        <div className="zone-info">
                            <span className="zone-label">Target Zone</span>
                            <span className="zone-value">{plan.zone}</span>
                        </div>
                        <div className="zone-info">
                            <span className="zone-label">Plan Created</span>
                            <span className="zone-value">{formatDate(plan.createdAt)}</span>
                        </div>
                        <div className="zone-info">
                            <span className="zone-label">Last Updated</span>
                            <span className="zone-value">{formatDate(plan.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderInterventions = () => (
        <div className="interventions-section">
            <div className="interventions-header">
                <h4>Selected Interventions ({plan.interventions.length})</h4>
                <div className="interventions-summary">
                    <span className="summary-item">
                        Total Cost: £{formatNumber(plan.totalCost)}
                    </span>
                    <span className="summary-item">
                        Total Impact: {plan.impact?.min || 0}-{plan.impact?.max || 0} dB
                    </span>
                </div>
            </div>
            
            <div className="interventions-list">
                {plan.interventions.map((intervention, index) => (
                    <div key={index} className="intervention-detail">
                        <div className="intervention-header-detail">
                            <h5>{intervention.name}</h5>
                            <span className="intervention-category">{intervention.category}</span>
                        </div>
                        
                        <p className="intervention-description-detail">{intervention.description}</p>
                        
                        <div className="intervention-stats-detail">
                            <div className="stat-box">
                                <span className="stat-label-detail">Cost Range</span>
                                <span className="stat-value-detail">
                                    £{formatNumber(intervention.costRange.min)} - £{formatNumber(intervention.costRange.max)}
                                </span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-label-detail">Impact Range</span>
                                <span className="stat-value-detail">
                                    {intervention.impactRange.min}-{intervention.impactRange.max} dB
                                </span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-label-detail">Feasibility</span>
                                <span className="stat-value-detail">
                                    {Math.round(intervention.feasibility * 100)}%
                                </span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-label-detail">Time Required</span>
                                <span className="stat-value-detail">{intervention.implementationTime}</span>
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
                <p className="current-status">
                    Current Status: 
                    <span 
                        className="status-badge-modal"
                        style={{
                            backgroundColor: statusOptions[plan.status].bgColor,
                            color: statusOptions[plan.status].color,
                            borderColor: statusOptions[plan.status].color
                        }}
                    >
                        {statusOptions[plan.status].label}
                    </span>
                </p>
                
                <div className="action-buttons">
                    {getNextStatusOptions().map(option => (
                        <button
                            key={option.value}
                            className="status-action-btn"
                            onClick={() => handleStatusUpdate(option.value)}
                            style={{ backgroundColor: option.color }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="additional-actions">
                <h4>Additional Actions</h4>
                <div className="action-buttons-grid">
                    <button className="action-btn secondary">
                        <span className="btn-icon">📄</span>
                        Generate Report
                    </button>
                    <button className="action-btn secondary">
                        <span className="btn-icon">📧</span>
                        Share Plan
                    </button>
                    <button className="action-btn secondary">
                        <span className="btn-icon">🔄</span>
                        Duplicate Plan
                    </button>
                    <button className="action-btn danger">
                        <span className="btn-icon">🗑️</span>
                        Delete Plan
                    </button>
                </div>
            </div>

            <div className="plan-notes">
                <h4>Notes & Comments</h4>
                <textarea
                    className="notes-textarea"
                    placeholder="Add notes or comments about this plan..."
                    rows={4}
                    defaultValue={plan.notes || ''}
                />
                <button className="save-notes-btn">Save Notes</button>
            </div>
        </div>
    );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-section">
                        {isEditingName ? (
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="name-edit-input"
                                autoFocus
                                onBlur={() => setIsEditingName(false)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') setIsEditingName(false);
                                }}
                            />
                        ) : (
                            <h2 
                                className="modal-title"
                                onDoubleClick={() => setIsEditingName(true)}
                                title="Double click to edit"
                            >
                                {plan.name}
                            </h2>
                        )}
                        <div className="modal-subtitle">
                            <span className="plan-id">ID: {plan.id}</span>
                            <span className="plan-date">Created: {formatDate(plan.createdAt)}</span>
                        </div>
                    </div>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="modal-tabs">
                    <button 
                        className={`modal-tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span className="tab-icon">📊</span>
                        Overview
                    </button>
                    <button 
                        className={`modal-tab ${activeTab === 'interventions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('interventions')}
                    >
                        <span className="tab-icon">🛠️</span>
                        Interventions ({plan.interventions.length})
                    </button>
                    <button 
                        className={`modal-tab ${activeTab === 'actions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('actions')}
                    >
                        <span className="tab-icon">⚡</span>
                        Actions
                    </button>
                </div>

                <div className="modal-body">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'interventions' && renderInterventions()}
                    {activeTab === 'actions' && renderActions()}
                </div>

                <div className="modal-footer">
                    <div className="footer-left">
                        <span className="last-updated">
                            Last updated: {formatDate(plan.createdAt)}
                        </span>
                    </div>
                    <div className="footer-right">
                        <button className="footer-btn secondary" onClick={onClose}>
                            Close
                        </button>
                        <button className="footer-btn primary">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanDetailModal;