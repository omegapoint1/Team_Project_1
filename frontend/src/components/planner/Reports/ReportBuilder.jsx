import React, { useState } from 'react';
import './ReportBuilder.css';
/*Section for building reports
Creates a section of selectors (checkboxes) where you select the generate sections
in your report. A preview button which generate a pdf modal of the report pdf is 
presented to review the report.
Perhaps more dynamic report generation late. 

*/ 
function ReportBuilder() {
  const [report, setReport] = useState({
    title: '',
    sections: [],
    dateRange: { start: null, end: null },
    zones: [],
    includeCharts: true,
    executiveSummary: '',
    exportOptions: {
      pdf: true,
      csv: false,
      powerpoint: false,
      email: false
    }
  });

  const [selectedZones, setSelectedZones] = useState(['Campus']);
  const [selectedSections, setSelectedSections] = useState(['executive-summary', 'data-sources', 'recommendations']);
  const [selectedCharts, setSelectedCharts] = useState(['hotspot-map']);
  
  const sections = [
    { id: 'executive-summary', name: 'Executive Summary', required: true },
    { id: 'methodology', name: 'Methodology', required: false },
    { id: 'data-sources', name: 'Data Sources', required: true },
    { id: 'hotspot-analysis', name: 'Hotspot Analysis', required: false },
    { id: 'incident-trends', name: 'Incident Trends', required: false },
    { id: 'mitigation-plans', name: 'Mitigation Plans', required: false },
    { id: 'recommendations', name: 'Recommendations', required: true },
    { id: 'appendix', name: 'Appendix', required: false }
  ];

  const chartOptions = [
    { id: 'hotspot-map', name: 'Hotspot Map' },
    { id: 'time-series', name: 'Time Series Analysis' },
    { id: 'incident-categories', name: 'Incident Categories' },
    { id: 'cost-benefit', name: 'Cost-Benefit Analysis' },
    { id: 'zone-comparison', name: 'Zone Comparison' }
  ];
 // Example zones currently using names may revert back not letters 
  const zones = ['Campus', 'Residential A', 'Residential B', 'Event Zone', 'Library'];


  const handleZoneToggle = (zone) => {
    setSelectedZones(prev => 
      prev.includes(zone) 
        ? prev.filter(z => z !== zone)
        : [...prev, zone]
    );
  };

  const handleSectionToggle = (sectionId) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(s => s !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleChartToggle = (chartId) => {
    setSelectedCharts(prev =>
      prev.includes(chartId)
        ? prev.filter(c => c !== chartId)
        : [...prev, chartId]
    );
  };

  const handleExportOptionToggle = (option) => {
    setReport(prev => ({
      ...prev,
      exportOptions: {
        ...prev.exportOptions,
        [option]: !prev.exportOptions[option]
      }
    }));
  };

  const handleTitleChange = (e) => {
    setReport(prev => ({ ...prev, title: e.target.value }));
  };

  const handleExecutiveSummaryChange = (e) => {
    setReport(prev => ({ ...prev, executiveSummary: e.target.value }));
  };

  const handleDateChange = (type, value) => {
    setReport(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: value
      }
    }));
  };

  const handlePreview = () => {
    const reportConfig = {
      ...report,
      zones: selectedZones,
      sections: selectedSections,
      charts: selectedCharts
    };
    console.log('Preview report with config:', reportConfig);
    alert(`Preview would show report with:\n- Title: ${report.title || 'Untitled'}\n- Sections: ${selectedSections.length}\n- Charts: ${selectedCharts.length}`);
  };

  const handleGenerate = () => {
    const reportConfig = {
      ...report,
      zones: selectedZones,
      sections: selectedSections,
      charts: selectedCharts
    };
    console.log('Generating report with config:', reportConfig);
    
    const exportFormats = Object.entries(report.exportOptions)
      .filter(([_, enabled]) => enabled)
      .map(([format]) => format.toUpperCase())
      .join(', ');
    
    alert(`Report generated successfully!\n\nExport formats: ${exportFormats || 'None selected'}\n\nThe report would now be available for download.`);
  };

  return (
    <div className="report-builder-container">
      <div className="report-builder-header">
        <div className="header-content">
          <h3 className="builder-title">Report Builder</h3>
          <div className="header-actions">
            <button className="preview-button" onClick={handlePreview}>
              Preview
            </button>
            <button className="generate-button" onClick={handleGenerate}>
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/*Report configuration*/}
      <div className="report-configuration">
        {/*Basic info */}
        <div className="config-section">
          <label className="section-label">Report Title</label>
          <input
            type="text"
            className="title-input"
            placeholder="e.g., Monthly Noise Management Report - January 2025"
            value={report.title}
            onChange={handleTitleChange}
          />
        </div>

    
        {/*Date ranges of the config section*/}
        <div className="config-section">
          <div className="date-range-container">
            <div className="date-input-group">
              <label className="section-label">Start Date</label>
              <input 
                type="date" 
                className="date-input"
                onChange={(e) => handleDateChange('start', e.target.value)}
              />
            </div>
            <div className="date-input-group">
              <label className="section-label">End Date</label>
              <input 
                type="date" 
                className="date-input"
                onChange={(e) => handleDateChange('end', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/*Zone selection*/}
        <div className="config-section">
          <label className="section-label">Zones to Include</label>
          <div className="zone-selection">
            {zones.map(zone => (
              <label key={zone} className="zone-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedZones.includes(zone)}
                  onChange={() => handleZoneToggle(zone)}
                />
                <span className="zone-label">{zone}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="config-section">
          <label className="section-label">Report Sections</label>
          <div className="sections-grid">
            {sections.map(section => (
              <label key={section.id} className={`section-checkbox ${section.required ? 'required-section' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={selectedSections.includes(section.id) || section.required}
                  onChange={() => !section.required && handleSectionToggle(section.id)}
                  disabled={section.required}
                />
                <span className="section-name">{section.name}</span>
                {section.required && <span className="required-badge">Required</span>}
              </label>
            ))}
          </div>
        </div>

        {/*charts selection */}
        <div className="config-section">
          <label className="section-label">Charts & Visualizations</label>
          <div className="charts-grid">
            {chartOptions.map(chart => (
              <label key={chart.id} className="chart-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedCharts.includes(chart.id)}
                  onChange={() => handleChartToggle(chart.id)}
                />
                <span className="chart-name">{chart.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/*Executive summary editor */}
        <div className="config-section">
          <label className="section-label">Executive Summary</label>
          <textarea
            className="executive-summary-input"
            placeholder="Provide a high-level summary of findings and recommendations..."
            value={report.executiveSummary}
            onChange={handleExecutiveSummaryChange}
            rows="4"
          />
        </div>

        {/*Exporting options */}
        <div className="config-section export-section">
          <h4 className="export-title">Export Options</h4>
          <div className="export-options">
            <label className="export-option">
              <input 
                type="checkbox" 
                checked={report.exportOptions.pdf}
                onChange={() => handleExportOptionToggle('pdf')}
              />
              <span>PDF Document</span>
            </label>
            <label className="export-option">
              <input 
                type="checkbox" 
                checked={report.exportOptions.csv}
                onChange={() => handleExportOptionToggle('csv')}
              />
              <span>CSV Data</span>
            </label>
            <label className="export-option">
              <input 
                type="checkbox" 
                checked={report.exportOptions.powerpoint}
                onChange={() => handleExportOptionToggle('powerpoint')}
              />
              <span>PowerPoint Slides</span>
            </label>
            <label className="export-option">
              <input 
                type="checkbox" 
                checked={report.exportOptions.email}
                onChange={() => handleExportOptionToggle('email')}
              />
              <span>Email to Stakeholders</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportBuilder;