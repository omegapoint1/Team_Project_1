import React, { useState } from 'react';
import './PlansList.css';

const PlansList = ({ plans, onViewPlan, onUpdateStatus, onDeletePlan }) => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    const statusOptions = [
        { value: 'Planned', label: 'Planned' },
        { value: 'In Progress', label: 'In Progress' }, 
        { value: 'Done', label: 'Done' },
        { value: 'Rejected/Cancelled', label: 'Rejected/Cancelled' }
    ];

    const sortOptions = [
        { value: 'createdAt', label: 'Date Created' },
        { value: 'name', label: 'Plan Name' },
        { value: 'totalCost', label: 'Total Cost' },
        { value: 'budget', label: 'Budget' }
    ];

    const formatImpact = (impact) => {
        if (impact === undefined || impact === null) return '0 dB';
        if (typeof impact === 'number') return `${impact} dB`;
        if (Array.isArray(impact)) {
            return `${impact[0] || 0}-${impact[1] || 0} dB`;
        }
        if (impact.min !== undefined) return `${impact.min}-${impact.max} dB`;
        return '0 dB';
    };

    const getImpactValue = (impact) => {
        if (impact === undefined || impact === null) return 0;
        if (typeof impact === 'number') return impact;
        if (Array.isArray(impact)) return impact[0] || 0;
        if (impact.min !== undefined) return impact.min;
        return 0;
    };

    const filteredPlans = plans.filter(plan => {
        if (filterStatus === 'all') return true;
        return plan.status === filterStatus;
    });

    const sortedPlans = [...filteredPlans].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (sortBy === 'createdAt') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }
        
        if (sortBy === 'totalCost' || sortBy === 'budget') {
            aValue = aValue || 0;
            bValue = bValue || 0;
        }

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
            <span className='status-badge' style={{
                backgroundColor: status === 'Planned' ? '#f59e0b' : 
                               status === 'In Progress' ? '#3b82f6' : 
                               status === 'Done' ? '#10b981' : '#ef4444'
            }}>
                {option.label}
            </span>
        );
    };

    const calculateBudgetUtilization = (totalCost, budget) => {
        if (!budget || budget === 0) return 0;
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
                </div>
            </div>

            <div className="filter-controls">
                <div className="filter-section">
                    <label className="filter-label">Filter by Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Plans ({plans.length})</option>
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label} ({plans.filter(p => p.status === option.value).length})
                            </option>
                        ))}
                    </select>
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
                            : `No ${statusOptions.find(s => s.value === filterStatus)?.label} plans found`
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
                        const impactDisplay = formatImpact(plan.impact);
                        
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
                                            <span className="meta-value">
                                                {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="plan-stats">
                                        <div className="stat-item">
                                            <div className="stat-label">Budget</div>
                                            <div className="stat-value">£{plan.budget || 0}</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-label">Total Cost</div>
                                            <div className="stat-value">£{plan.totalCost || 0}</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-label">Interventions</div>
                                            <div className="stat-value">{plan.interventions?.length || 0}</div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-label">Timeline</div>
                                            <div className="stat-value">{plan.timeline || 0} weeks</div>
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
                                        <div className="impact-label">Estimated Impact</div>
                                        <div className="impact-value">
                                            {impactDisplay}
                                        </div>
                                    </div>

                                    <div className="plan-footer">
                                        <div className="intervention-tags">
                                            {plan.interventions?.slice(0, 3).map((intervention, index) => (
                                                <span key={index} className="intervention-tag">
                                                    {typeof intervention === 'string' 
                                                        ? `ID: ${intervention}` 
                                                        : intervention.name || intervention}
                                                </span>
                                            ))}
                                            {plan.interventions?.length > 3 && (
                                                <span className="intervention-tag more">
                                                    +{plan.interventions.length - 3} more
                                                </span>
                                            )}
                                        </div>
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
                                    £{plans.reduce((sum, plan) => sum + (plan.totalCost || 0), 0)}
                                </span>
                            </div>
                            <div className="summary-stat">
                                <span className="stat-label">Average Impact</span>
                                <span className="stat-value">
                                    {formatImpact(plans.reduce((sum, plan) => sum + getImpactValue(plan.impact), 0) / plans.length)}
                                </span>
                            </div>
                            <div className="summary-stat">
                                <span className="stat-label">Active Plans</span>
                                <span className="stat-value">
                                    {plans.filter(p => p.status !== 'Rejected/Cancelled' && p.status !== 'Done').length}
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