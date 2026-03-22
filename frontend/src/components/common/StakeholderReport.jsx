
/**
  StakeholderReport component that generates comprehensive PDF reports combining incident data,
  noise hotspots, overview statistics, mitigation scenarios, and intervention plans some by fetching data from server/local services and
   uses jsPDF with autoTable for document generation.
 */

import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { incidentServerService, incidentLocalService } from '../services/incidentService';
import { scenarioServerService, scenarioLocalService } from '../services/scenarioService';
import { planServerService, planLocalService } from '../services/planService';

const StakeholderReport = ({ 
  incidents = null,
  hotspots = [],
  overviewStats = null,
  onExportComplete 
}) => {
  const [loading, setLoading] = useState(false);
  const [scenarios, setScenarios] = useState([]);
  const [plans, setPlans] = useState([]);
  const [incidentData, setIncidentData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch incidents
        let incData = incidents;
        if (!incData) {
          try {
            incData = await incidentServerService.getAll();
            if (!incData || incData.length === 0) {
              incData = incidentLocalService.getAll();
            }
          } catch (err) {
            console.error('Error fetching incidents:', err);
            incData = incidentLocalService.getAll();
          }
        }
        setIncidentData(incData || []);

        //Fetch scenarios
        let scenarioData = [];
        try {
          scenarioData = await scenarioServerService.getAll();
          if (!scenarioData || scenarioData.length === 0) {
            scenarioData = scenarioLocalService.getAll();
          }
        } catch (err) {
          console.error('Error fetching scenarios:', err);
          scenarioData = scenarioLocalService.getAll();
        }
        setScenarios(scenarioData || []);

        // Fetch plans
        let planData = [];
        try {
          planData = await planServerService.getAll();
          if (!planData || planData.length === 0) {
            planData = planLocalService.getAll();
          }
        } catch (err) {
          console.error('Error fetching plans:', err);
          planData = planLocalService.getAll();
        }
        setPlans(planData || []);

        setError(null);
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError('Failed to load some data. Report will be generated with available data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [incidents]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatImpact = (impact) => {
    if (!impact) return '0 dB';
    if (typeof impact === 'number') return `${impact} dB`;
    if (Array.isArray(impact)) return `${impact[0] || 0}-${impact[1] || 0} dB`;
    if (impact.min !== undefined) return `${impact.min}-${impact.max} dB`;
    return '0 dB';
  };

  const formatCost = (cost) => {
    if (!cost) return '£0';
    if (typeof cost === 'number') return `£${cost.toLocaleString()}`;
    if (Array.isArray(cost)) return `£${cost[0] || 0}-${cost[1] || 0}`;
    if (cost.min !== undefined) return `£${cost.min}-${cost.max}`;
    return `£${cost}`;
  };

  const generatePDF = async () => {
    setLoading(true);
    
    try {
      const doc = new jsPDF();
      let yPosition = 15;

      //title
      doc.setFontSize(24);
      doc.text('Stakeholder Report', 14, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, yPosition);
      yPosition += 15;

      // 1. Overview stats section
      if (overviewStats) {
        doc.setFontSize(16);
        doc.text('1. Overview Statistics', 14, yPosition);
        yPosition += 8;
        
        doc.setFontSize(11);
        doc.text(`Reports (24h): ${overviewStats.reports24h || 0}`, 14, yPosition);
        yPosition += 6;
        doc.text(`Reports (7d): ${overviewStats.reports7d || 0}`, 14, yPosition);
        yPosition += 6;
        doc.text(`Reports (30d): ${overviewStats.reports30d || 0}`, 14, yPosition);
        yPosition += 6;
        doc.text(`Average Severity (7d): ${(overviewStats.avgSeverity7d || 0).toFixed(1)}/10`, 14, yPosition);
        yPosition += 15;
      }

      // 2. Hotspots section
      if (hotspots && hotspots.length > 0) {
        if (yPosition > doc.internal.pageSize.height - 60) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(16);
        doc.text('2. Top Noise Hotspots', 14, yPosition);
        yPosition += 8;
        
        const hotspotRows = hotspots.slice(0, 10).map((hotspot, idx) => [
          idx + 1,
          hotspot.zone || hotspot[1] || 'Unknown',
          hotspot.count || hotspot[0] || 0
        ]);
        
        autoTable(doc, {
          head: [['#', 'Zone', 'Report Count']],
          body: hotspotRows,
          startY: yPosition,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [41, 128, 185] },
          alternateRowStyles: { fillColor: [245, 245, 245] }
        });
        
        yPosition = doc.lastAutoTable.finalY + 15;
      }

      // 3. Incidents Section
      if (incidentData && incidentData.length > 0) {
        if (yPosition > doc.internal.pageSize.height - 60) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(16);
        doc.text('3. Incident Summary', 14, yPosition);
        yPosition += 8;
        
        const pendingCount = incidentData.filter(i => i.status === 'Pending').length;
        const acceptedCount = incidentData.filter(i => i.status === 'Accepted').length;
        const rejectedCount = incidentData.filter(i => i.status === 'Rejected').length;
        
        doc.setFontSize(11);
        doc.text(`Total Incidents: ${incidentData.length}`, 14, yPosition);
        yPosition += 6;
        doc.text(`Pending: ${pendingCount}`, 14, yPosition);
        yPosition += 5;
        doc.text(`Accepted: ${acceptedCount}`, 14, yPosition);
        yPosition += 5;
        doc.text(`Rejected: ${rejectedCount}`, 14, yPosition);
        yPosition += 12;
        
        const recentIncidents = incidentData.slice(0, 10).map(inc => [
          inc.id,
          inc.noisetype || inc.title || 'N/A',
          inc.zone || 'Unknown',
          inc.severity || 'N/A',
          inc.status || 'Pending',
          inc.datetime ? new Date(inc.datetime).toLocaleDateString() : 'N/A'
        ]);
        
        autoTable(doc, {
          head: [['ID', 'Type', 'Zone', 'Severity', 'Status', 'Date']],
          body: recentIncidents,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [41, 128, 185] },
          alternateRowStyles: { fillColor: [245, 245, 245] }
        });
        
        yPosition = doc.lastAutoTable.finalY + 15;
      }

      // 4. scenarios sction
      if (scenarios && scenarios.length > 0) {
        if (yPosition > doc.internal.pageSize.height - 60) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(16);
        doc.text('4. Mitigation Scenarios', 14, yPosition);
        yPosition += 8;
        
        const scenarioRows = scenarios.map(scenario => [
          scenario.name,
          formatCost(scenario.metrics?.totalCost || 0),
          formatImpact(scenario.metrics?.impact),
          `${(scenario.metrics?.feasibility || 0).toFixed(1)}/10`,
          scenario.metrics?.timeline || 'N/A'
        ]);
        
        autoTable(doc, {
          head: [['Scenario', 'Cost', 'Impact', 'Feasibility', 'Timeline']],
          body: scenarioRows,
          startY: yPosition,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [41, 128, 185] },
          alternateRowStyles: { fillColor: [245, 245, 245] }
        });
        
        yPosition = doc.lastAutoTable.finalY + 15;
      }

      // 5. Intervention plans section
      if (plans && plans.length > 0) {
        if (yPosition > doc.internal.pageSize.height - 60) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(16);
        doc.text('5. Intervention Plans', 14, yPosition);
        yPosition += 8;
        
        const planRows = plans.map(plan => [
          plan.name,
          plan.zone,
          formatCost(plan.budget || 0),
          formatCost(plan.totalCost || 0),
          formatImpact(plan.impact),
          plan.status || 'draft',
          new Date(plan.createdAt).toLocaleDateString()
        ]);
        
        autoTable(doc, {
          head: [['Plan Name', 'Zone', 'Budget', 'Cost', 'Impact', 'Status', 'Created']],
          body: planRows,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [41, 128, 185] },
          alternateRowStyles: { fillColor: [245, 245, 245] }
        });
        
        yPosition = doc.lastAutoTable.finalY + 15;
      }

      //Footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Page ${i} of ${pageCount}`, 
          doc.internal.pageSize.width - 20, 
          doc.internal.pageSize.height - 10
        );
      }

      const filename = `stakeholder_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      if (onExportComplete) {
        onExportComplete(true);
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF');
      if (onExportComplete) {
        onExportComplete(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stakeholder-report">
      <button 
        onClick={generatePDF}
        disabled={loading}
        className="export-report-btn"
        style={{
          padding: '10px 20px',
          background: loading ? '#cccccc' : '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>📊</span>
        {loading ? 'Generating Report...' : 'Export Stakeholder Report'}
      </button>
      
      {error && (
        <div style={{ 
          marginTop: '8px', 
          fontSize: '12px', 
          color: '#f59e0b',
          textAlign: 'center'
        }}>
           {error}
        </div>
      )}
    </div>
  );
};

export default StakeholderReport;