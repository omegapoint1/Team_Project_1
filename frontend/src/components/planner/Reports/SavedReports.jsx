import React, { useState } from 'react';

const SavedReportsTable = ({ onSelectReport }) => {
  //Mock saved reports data
  const [savedReports, setSavedReports] = useState([
    {
      id: 1,
      name: 'Monthly Noise Report - Jan 2025',
      type: 'monthly-summary',
      dateCreated: '2025-01-31',
      size: '2.4 MB',
      sections: ['summary', 'incidents', 'hotspots'],
      format: 'pdf',
      selected: false
    },
    {
      id: 2,
      name: 'Campus Zone Analysis',
      type: 'hotspot-analysis',
      dateCreated: '2025-01-28',
      size: '1.8 MB',
      sections: ['hotspots', 'plans'],
      format: 'pdf',
      selected: false
    },
    {
      id: 3,
      name: 'Incident Review - Week 3',
      type: 'incident-review',
      dateCreated: '2025-01-22',
      size: '1.2 MB',
      sections: ['incidents'],
      format: 'csv',
      selected: false
    },
    {
      id: 4,
      name: 'Mitigation Proposal - Barriers',
      type: 'mitigation-proposal',
      dateCreated: '2025-01-20',
      size: '3.2 MB',
      sections: ['summary', 'plans', 'recommendations'],
      format: 'pdf',
      selected: false
    },
    {
      id: 5,
      name: 'Community Update Report',
      type: 'community-update',
      dateCreated: '2025-01-15',
      size: '1.5 MB',
      sections: ['summary', 'recommendations'],
      format: 'pdf',
      selected: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormat, setFilterFormat] = useState('all');

  //reports filtering based on search and filter
  const filteredReports = savedReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = filterFormat === 'all' || report.format === filterFormat;
    return matchesSearch && matchesFormat;
  });

  //Handle report selection
  const handleSelectReport = (reportId) => {
    const updatedReports = savedReports.map(report => ({
      ...report,
      selected: report.id === reportId ? !report.selected : false
    }));
    
    setSavedReports(updatedReports);
    
    //find the selected report and pass
    const selectedReport = updatedReports.find(r => r.selected);
    if (selectedReport && onSelectReport) {
      onSelectReport(selectedReport);
    }
  };

  //load saved report configuration into the builder
  const handleLoadReport = (report) => {
    if (onSelectReport) {
      onSelectReport(report);
    }
  };

  //delete a saved report
  const handleDeleteReport = (reportId, e) => {
    e.stopPropagation(); //prevent row selection when clicking delete
    if (window.confirm('Are you sure you want to delete this saved report?')) {
      setSavedReports(savedReports.filter(report => report.id !== reportId));
    }
  };

  //Sets badge color based on report type
  /**Reminder: Perhaps remove the other reportstyles e.g mitIGATIONS  */
  const getTypeBadge = (type) => {
    const badgeStyles = {
      'monthly-summary': { bg: 'blue', text: 'Monthly' },
      'hotspot-analysis': { bg: 'red', text: 'Hotspot' },
      'incident-review': { bg: 'green', text: 'Incident' },
      'mitigation-proposal': { bg: 'purple', text: 'Proposal' },
      'community-update': { bg: 'orange', text: 'Community' }
    };
    
    const style = badgeStyles[type] || { bg: 'gray', text: 'Other' };
    return style;
  };

  //Getting icon for the exporting format
  const getFormatIcon = (format) => {
    return format === 'pdf' ? '📄' : '📊';
  };

  return (
    <div className="saved-reports-container">
      <div className="saved-reports-header">
        <h3 className="saved-reports-title">Saved Reports</h3>
        <span className="saved-reports-count">{filteredReports.length} reports</span>
      </div>

      {/*search-Filter bar*/}
      <div className="search-filter-bar">
        <div className="search-input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search saved reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="clear-search-btn"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="filter-dropdown">
          <select 
            value={filterFormat}
            onChange={(e) => setFilterFormat(e.target.value)}
            className="format-filter"
          >
            <option value="all">All Formats</option>
            <option value="pdf">PDF Only</option>
            <option value="csv">CSV Only</option>
          </select>
        </div>
      </div>

      {/* Saved reports TABLE*/}
      <div className="reports-table-container">
        {filteredReports.length === 0 ? (
          <div className="no-reports-message">
            No saved reports found. Create and save a report to see it here.
          </div>
        ) : (
          <table className="saved-reports-table">
            <thead>
              <tr>
                <th className="select-col">Select</th>
                <th className="name-col">Report Name</th>
                <th className="type-col">Type</th>
                <th className="date-col">Date</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => {
                const badgeStyle = getTypeBadge(report.type);
                return (
                  <tr 
                    key={report.id}
                    className={`report-row ${report.selected ? 'selected-row' : ''}`}
                    onClick={() => handleSelectReport(report.id)}
                  >
                    <td className="select-cell">
                      <input
                        type="radio"
                        name="selectedReport"
                        checked={report.selected}
                        onChange={() => handleSelectReport(report.id)}
                        className="report-radio"
                      />
                    </td>
                    <td className="name-cell">
                      <div className="report-name-container">
                        <span className="format-icon">
                          {getFormatIcon(report.format)}
                        </span>
                        <div className="report-name-details">
                          <div className="report-name">{report.name}</div>
                          <div className="report-meta">
                            <span className="report-size">{report.size}</span>
                            <span className="report-sections">
                              {report.sections.length} sections
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="type-cell">
                      <span className={`type-badge badge-${badgeStyle.bg}`}>
                        {badgeStyle.text}
                      </span>
                    </td>
                    <td className="date-cell">
                      <div className="report-date">
                        {new Date(report.dateCreated).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="actions-cell">
                      <button
                        onClick={() => handleLoadReport(report)}
                        className="load-btn"
                        title="Load into builder"
                      >
                        📂 Load
                      </button>
                      <button
                        onClick={(e) => handleDeleteReport(report.id, e)}
                        className="delete-btn"
                        title="Delete report"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/*Current processing report*/}
      {savedReports.some(r => r.selected) && (
        <div className="selected-report-info">
          <h4>Selected Report</h4>
          <div className="selected-report-details">
            {savedReports
              .filter(r => r.selected)
              .map(report => (
                <div key={report.id} className="selected-report">
                  <div className="selected-report-name">{report.name}</div>
                  <div className="selected-report-sections">
                    <strong>Sections:</strong> {report.sections.join(', ')}
                  </div>
                  <button 
                    onClick={() => handleLoadReport(report)}
                    className="load-selected-btn"
                  >
                    Load into Report Builder
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedReportsTable;