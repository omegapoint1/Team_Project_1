import React, { useState } from 'react';
import './PlansList.css';

const PlansList = ({ plans, onViewPlan, onUpdateStatus, onDeletePlan }) => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    const statusOptions = [
        { value: 'all', label: 'All Plans', color: '#94a3b8' },
        { value: 'draft', label: 'Draft', color: '#f59e0b' },
        { value: 'submitted', label: 'Submitted', color: '#3b82f6' },
        { value: 'approved', label: 'Approved', color: '#8b5cf6' },
        { value: 'implemented', label: 'Implemented', color: '#10b981' },
        { value: 'rejected', label: 'Rejected', color: '#ef4444' }
    ];

    const sortOptions = [
        { value: 'createdAt', label: 'Date Created' },
        { value: 'name', label: 'Plan Name' },
        { value: 'totalCost', label: 'Total Cost' },
        { value: 'budget', label: 'Budget' }
    ];

    const filteredPlans = plans.filter(plan => {
        if (filterStatus === 'all') return true;
        return plan.status === filterStatus;
    });

    const sortedPlans = [...filteredPlans].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        //Handle date sorting
        if (sortBy === 'createdAt') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }

        //Handle string sorting
        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const getStatusBadge = (status) => {
        const option = statusOptions.find(opt => opt.value === status);
        if (!option) return null;
        
        return (
            <span 
                className="status-badge"
                style={{ 
                    backgroundColor: `${option.color}20`,
                    color: option.color,
                    borderColor: option.color
                }}
            >
                {option.label}
            </span>
        );
    };

    const getNextStatus = (currentStatus) => {
        switch(currentStatus) {
            case 'draft': return 'submitted';
            case 'submitted': return 'approved';
            case 'approved': return 'implemented';
            case 'rejected': return 'draft';
            default: return 'draft';
        }
    };

    const getActionLabel = (currentStatus) => {
        switch(currentStatus) {
            case 'draft': return 'Submit for Review';
            case 'submitted': return 'Mark as Approved';
            case 'approved': return 'Mark as Implemented';
            case 'rejected': return 'Return to Draft';
            default: return 'Update Status';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateBudgetUtilization = (totalCost, budget) => {
        return Math.min(Math.round((totalCost / budget) * 100), 100);
    };

    return (
        <div className="plans-list">
            <div className="list-header">
                <div className="header-left">
                    <h2>My Mitigation Plans</h2>
                    <p className="plan-count">
                        {sortedPlans.length} plan{sortedPlans.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                <div className="header-actions">
                    <button className="export-button" onClick={() => alert('Export feature coming soon!')}>
                        <span className="export-icon">📊</span>
                        Export Plans
                    </button>
                </div>
            </div>

            <div className="filter-controls">
                <div className="filter-section">
                    <label className="filter-label">Filter by Status</label>
                    <div className="status-filters">
                        {statusOptions.map(option => (
                            <button
                                key={option.value}
                                className={`status-filter ${filterStatus === option.value ? 'active' : ''}`}
                                onClick={() => setFilterStatus(option.value)}
                                style={{
                                    backgroundColor: filterStatus === option.value ? option.color : 'transparent',
                                    color: filterStatus === option.value ? 'white' : option.color,
                                    borderColor: option.color
                                }}
                            >
                                {option.label}
                                <span className="status-count">
                                    {plans.filter(p => p.status === option.value).length}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="sort-controls">
                    <div className="sort-group">
                        <label className="sort-label">Sort by</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="sort-group">
                        <label className="sort-label">Order</label>
                        <button
                            className={`order-button ${sortOrder === 'desc' ? 'active' : ''}`}
                            onClick={() => setSortOrder('desc')}
                        >
                            <span className="order-icon">↓</span>
                            Desc
                        </button>
                        <button
                            className={`order-button ${sortOrder === 'asc' ? 'active' : ''}`}
                            onClick={() => setSortOrder('asc')}
                        >
                            <span className="order-icon">↑</span>
                            Asc
                        </button>
                    </div>
                </div>
            </div>

            {sortedPlans.length === 0 ? (
                <div className="empty-plans">
                    <div className="empty-icon">📋</div>
                    <h3>No plans found</h3>
                    <p>
                        {filterStatus === 'all' 
                            ? 'Create your first mitigation plan to get started!'
                            : `No ${statusOptions.find(s => s.value === filterStatus)?.label?.toLowerCase()} plans found`
                        }
                    </p>
                    {filterStatus !== 'all' && (
                        <button 
                            className="clear-filter-button"
                            onClick={() => setFilterStatus('all')}
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
            ) : (
                <div className="plans-grid">
                    {sortedPlans.map(plan => {
                        const budgetUtilization = calculateBudgetUtilization(plan.totalCost, plan.budget);
                        
                        return (
                            <div key={plan.id} className="plan-card">
                                <div className="plan-card-header">
                                    <div className="plan-title-section">
                                        <h3 className="plan-name">{plan.name}</h3>
                                        {getStatusBadge(plan.status)}
                                    </div>
                                    <div className="plan-actions">
                                        <button
                                            className="action-button view-button"
                                            onClick={() => onViewPlan(plan)}
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            className="action-button delete-button"
                                            onClick={() => onDeletePlan(plan.id)}
                                            title="Delete Plan"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                <div className="plan-content">
                                    <div className="plan-meta">
                                        <div className="meta-item">
                                            <span className="meta-label">Zone:</span>
                                            <span className="meta-value">{plan.zone}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Created:</span>
                                            <span className="meta-value">{formatDate(plan.createdAt)}</span>
                                        </div>
                                    </div>

                                    <div className="plan-stats">
                                        <div className="stat-item">
                                            <div className="stat-label">Budget</div>
                                            <div className="stat-value">£{plan.budget.toLocaleString('en-GB')}</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-label">Total Cost</div>
                                            <div className="stat-value">£{plan.totalCost.toLocaleString('en-GB')}</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-label">Interventions</div>
                                            <div className="stat-value">{plan.interventions.length}</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-label">Timeline</div>
                                            <div className="stat-value">{plan.timeline} weeks</div>
                                        </div>
                                    </div>

                                    <div className="budget-meter">
                                        <div className="meter-header">
                                            <span className="meter-label">Budget Utilization</span>
                                            <span className="meter-percentage">{budgetUtilization}%</span>
                                        </div>
                                        <div className="meter-bar">
                                            <div 
                                                className="meter-fill"
                                                style={{ 
                                                    width: `${budgetUtilization}%`,
                                                    backgroundColor: budgetUtilization > 100 ? '#ef4444' : 
                                                                   budgetUtilization > 80 ? '#f59e0b' : '#10b981'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="plan-impact">
                                        <div className="impact-label">Estimated Impact</div>{/*Predicted impact?*/}
                                        <div className="impact-value">
                                            {plan.impact?.min || 0}-{plan.impact?.max || 0} dB reduction
                                        </div>
                                    </div>

                                    <div className="plan-footer">
                                        <div className="intervention-tags">
                                            {plan.interventions.slice(0, 3).map((intervention, index) => (
                                                <span key={index} className="intervention-tag">
                                                    {intervention.name}
                                                </span>
                                            ))}
                                            {plan.interventions.length > 3 && (
                                                <span className="intervention-tag more">
                                                    +{plan.interventions.length - 3} more
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            className="status-action-button"
                                            onClick={() => onUpdateStatus(plan.id, getNextStatus(plan.status))}
                                            style={{
                                                backgroundColor: statusOptions.find(s => s.value === plan.status)?.color
                                            }}
                                        >
                                            {getActionLabel(plan.status)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {sortedPlans.length > 0 && (
                <div className="plans-summary">
                    <div className="summary-card">
                        <h4>Plans Summary</h4>
                        <div className="summary-stats">
                            <div className="summary-stat">
                                <span className="stat-label">Total Investment</span>
                                <span className="stat-value">
                                    £{plans.reduce((sum, plan) => sum + plan.totalCost, 0).toLocaleString('en-GB')}
                                </span>
                            </div>
                            <div className="summary-stat">
                                <span className="stat-label">Average Impact</span>
                                <span className="stat-value">
                                    {Math.round(plans.reduce((sum, plan) => sum + (plan.impact?.min || 0), 0) / plans.length)}-
                                    {Math.round(plans.reduce((sum, plan) => sum + (plan.impact?.max || 0), 0) / plans.length)} dB
                                </span>
                            </div>
                            <div className="summary-stat">
                                <span className="stat-label">Active Plans</span>
                                <span className="stat-value">
                                    {plans.filter(p => p.status !== 'rejected').length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlansList;