import React from 'react';
import './ReportTemplates.css';
/* Loading report templates  in table*/
const ReportTemplates = ({ loadTemplate }) => {
  const templates = [
    {
      id: 'monthly-summary',
      name: 'Monthly Noise Summary',
      description: 'Overview of noise trends, incidents, and hotspots',
      audience: 'Management',
      estimatedTime: '5 min',
      icon: '📊'
    },
    {
      id: 'hotspot-analysis',
      name: 'Hotspot Analysis Report',
      description: 'Deep dive into specific noise hotspots with root causes',
      audience: 'Technical Team',
      estimatedTime: '10 min',
      icon: '🔥'
    },
    {
      id: 'mitigation-proposal',
      name: 'Mitigation Funding Proposal',
      description: 'Business case for intervention funding',
      audience: 'Finance/Leadership',
      estimatedTime: '15 min',
      icon: '💰'
    },
    {
      id: 'community-update',
      name: 'Community Update',
      description: 'Public-facing report on noise management efforts',
      audience: 'Public/Residents',
      estimatedTime: '8 min',
      icon: '👥'
    },
    {
      id: 'incident-review',
      name: 'Incident Review Report',
      description: 'Analysis of reported incidents and responses',
      audience: 'Operations',
      estimatedTime: '7 min',
      icon: '📝'
    },
    {
      id: 'custom',
      name: 'Custom Report',
      description: 'Build from scratch with full control',
      audience: 'Any',
      estimatedTime: 'Varies',
      icon: '⚙️'
    }
  ];

  return (
    <div className="report-templates-container">
      <h3 className="templates-title">Report Templates</h3>
      <div className="templates-list">
        {templates.map(template => (
          <button
            key={template.id}
            className="template-button"
            onClick={() => loadTemplate && loadTemplate(template.id)}
            aria-label={`Select ${template.name} template`}
          >
            <div className="template-content">
              <span className="template-icon">{template.icon}</span>
              <div className="template-details">
                <div className="template-name">{template.name}</div>
                <div className="template-description">{template.description}</div>
                <div className="template-meta">
                  <span className="template-audience">
                    <strong>For:</strong> {template.audience}
                  </span>
                </div>
              </div>
              <span className="time-badge">
                {template.estimatedTime}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportTemplates;