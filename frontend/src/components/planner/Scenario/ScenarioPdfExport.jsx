import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ScenarioPdfExport = ({ scenarios, weights, onExportComplete }) => {
  if (!scenarios || scenarios.length === 0) {
    return null;
  }

  const formatCost = (cost) => {
    if (cost === undefined || cost === null) return '£0';
    if (typeof cost === 'number') return `£${cost.toLocaleString()}`;
    return `£${cost}`;
  };

  const formatImpact = (impact) => {
    if (impact === undefined || impact === null) return '0 dB';
    if (typeof impact === 'number') return `${impact} dB`;
    if (Array.isArray(impact)) return `${impact[0] || 0}-${impact[1] || 0} dB`;
    if (impact.min !== undefined) return `${impact.min}-${impact.max} dB`;
    return '0 dB';
  };

  const formatFeasibility = (feasibility) => {
    if (feasibility === undefined || feasibility === null) return '0%';
    if (typeof feasibility === 'number') {
      if (feasibility <= 1) return `${Math.round(feasibility * 100)}%`;
      return `${Math.round(feasibility)}%`;
    }
    return `${feasibility}%`;
  };

  const calculateScore = (scenario, metric) => {
    const scores = scenario.scores || {};
    switch(metric) {
      case 'cost': return scores.cost || 0;
      case 'impact': return scores.impact || 0;
      case 'feasibility': return scores.feasibility || 0;
      default: return 0;
    }
  };

  const getRecommendation = () => {
    if (!scenarios.length) return 'No scenarios to compare';
    
    const scored = scenarios.map(scenario => {
      const costScore = calculateScore(scenario, 'cost') * (weights.cost / 100);
      const impactScore = calculateScore(scenario, 'impact') * (weights.impact / 100);
      const feasibilityScore = calculateScore(scenario, 'feasibility') * (weights.feasibility / 100);
      const totalScore = costScore + impactScore + feasibilityScore;
      return { scenario, totalScore };
    });
    
    scored.sort((a, b) => b.totalScore - a.totalScore);
    return scored[0]?.scenario || null;
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 15;

      // Title
      doc.setFontSize(20);
      doc.text('Scenario Comparison Report', 14, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, yPosition);
      yPosition += 10;
      
      // Weight information
      doc.setFontSize(11);
      doc.text('Priority Weights:', 14, yPosition);
      yPosition += 6;
      doc.text(`Cost: ${weights.cost}%  |  Impact: ${weights.impact}%  |  Feasibility: ${weights.feasibility}%`, 14, yPosition);
      yPosition += 15;

      // Scenarios comparison table
      doc.setFontSize(14);
      doc.text('Scenarios Comparison', 14, yPosition);
      yPosition += 8;

      const tableColumn = ['Scenario', 'Cost', 'Impact', 'Feasibility', 'Score'];
      const tableRows = scenarios.map(scenario => [
        scenario.name,
        formatCost(scenario.metrics?.totalCost || scenario.totalCost || 0),
        formatImpact(scenario.metrics?.impact || scenario.impact),
        formatFeasibility(scenario.metrics?.feasibility || scenario.feasibility),
        `${calculateScore(scenario, 'cost') + calculateScore(scenario, 'impact') + calculateScore(scenario, 'feasibility')}/10`
      ]);

      // Use autoTable
      if (typeof autoTable === 'function') {
        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: yPosition,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          alternateRowStyles: { fillColor: [245, 245, 245] }
        });
        yPosition = doc.lastAutoTable.finalY + 15;
      } else {
        // Fallback if autoTable not available
        doc.text('Scenarios:', 14, yPosition);
        scenarios.forEach((scenario, idx) => {
          const textY = yPosition + 8 + (idx * 10);
          doc.text(`${idx + 1}. ${scenario.name} - Cost: ${formatCost(scenario.metrics?.totalCost || scenario.totalCost || 0)}`, 14, textY);
        });
        yPosition = yPosition + 20 + (scenarios.length * 10);
      }

      // Recommendation
      const recommended = getRecommendation();
      if (recommended) {
        if (yPosition > doc.internal.pageSize.height - 60) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.text('Recommendation', 14, yPosition);
        yPosition += 8;
        doc.setFontSize(11);
        doc.text(`Based on your priorities, the recommended scenario is:`, 14, yPosition);
        yPosition += 6;
        doc.setFontSize(12);
        doc.text(`${recommended.name}`, 14, yPosition);
        yPosition += 8;
        doc.setFontSize(10);
        doc.text(recommended.description || 'No description available', 14, yPosition);
      }

      // Detailed scenario breakdown
      scenarios.forEach((scenario, idx) => {
        if (yPosition > doc.internal.pageSize.height - 80) {
          doc.addPage();
          yPosition = 20;
        }
        
        yPosition += 15;
        doc.setFontSize(12);
        doc.text(`${idx + 1}. ${scenario.name} - Detailed Breakdown`, 14, yPosition);
        yPosition += 6;
        doc.setFontSize(10);
        doc.text(`Description: ${scenario.description || 'No description'}`, 14, yPosition);
        yPosition += 6;
        doc.text(`Cost: ${formatCost(scenario.metrics?.totalCost || scenario.totalCost || 0)}`, 14, yPosition);
        yPosition += 5;
        doc.text(`Impact: ${formatImpact(scenario.metrics?.impact || scenario.impact)}`, 14, yPosition);
        yPosition += 5;
        doc.text(`Feasibility: ${formatFeasibility(scenario.metrics?.feasibility || scenario.feasibility)}`, 14, yPosition);
        yPosition += 5;
        doc.text(`Timeline: ${scenario.metrics?.timeline || scenario.timeline || 'Not specified'}`, 14, yPosition);
        yPosition += 10;
        
        if (scenario.interventionIds && scenario.interventionIds.length > 0) {
          doc.text(`Interventions (${scenario.interventionIds.length}):`, 14, yPosition);
          yPosition += 5;
          scenario.interventionIds.forEach((int, intIdx) => {
            if (yPosition > doc.internal.pageSize.height - 20) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(`  ${intIdx + 1}. ID: ${int}`, 14, yPosition);
            yPosition += 4;
          });
          yPosition += 5;
        }
      });

      // Footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
      }

      const filename = `scenario_comparison_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      if (onExportComplete) {
        onExportComplete(true);
      }
    } catch (error) {
      console.error('PDF Export failed:', error);
      if (onExportComplete) {
        onExportComplete(false);
      }
      alert('Failed to generate PDF. Please check console for details.');
    }
  };

  return (
    <button onClick={exportToPDF} className="export-pdf-button" title="Export scenarios to PDF">
      <span>📄</span> Export PDF
    </button>
  );
};

export default ScenarioPdfExport;