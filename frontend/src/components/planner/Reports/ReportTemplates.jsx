import React from 'react';
import './ReportTemplates.css';
/* Loading report templates  in table*/
const ReportTemplates = ({ loadTemplate }) => {
  const templates = [
    /* P[erhaps add Scenario comparison and or decide 
    whether each page should allow individual reports exporting aswell*/
    {
      id: 'monthly-summary',
      name: 'Monthly Noise Summary',
      description: 'Overview of noise trends, incidents, and hotspots',
      audience: 'Project Owners',
      icon: '📊'
    },
    {
      id: 'hotspot-analysis',
      name: 'Hotspot Analysis Report',
      description: 'Deep dive into specific noise hotspots',
      audience: 'Technical Team',
      icon: '🔥'
    },
    {
      id: 'mitigation-proposal',
      name: 'Mitigation Proposal Report',
      description: 'proposal on mitigation plans for requesting funding',
      audience: 'Stakeholders/Funding',
      icon: '💰'
    },
    {
      id: 'stakeholder-report',
      name: 'Stakeholder report',
      description: 'General template for stakeholders',
      audience: 'StakeholderS',
      icon: '👥'
    },
    {
      id: 'incident-review',
      name: 'Incident Review Report',
      description: 'Analysis of reported incidents and responses',
      audience: 'Users and operators ',
      icon: '📝'
    },
    {
      id: 'custom',
      name: 'Custom Report',
      description: 'Build from scratch with more control',
      audience: 'Any',
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
  
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportTemplates;