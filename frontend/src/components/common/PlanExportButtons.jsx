import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

const PlanExportButtons = ({ plan }) => {
  if (!plan) return null;

  const formatCost = (cost) => {
    if (cost === undefined || cost === null) return '£0';
    if (typeof cost === 'number') return `£${cost}`;
    if (Array.isArray(cost)) return `£${cost[0] || 0}-£${cost[1] || 0}`;
    if (cost.min !== undefined) return `£${cost.min}-£${cost.max}`;
    return '£0';
  };

  const formatImpact = (impact) => {
    if (impact === undefined || impact === null) return '0 dB';
    if (typeof impact === 'number') return `${impact} dB`;
    if (Array.isArray(impact)) return `${impact[0] || 0}-${impact[1] || 0} dB`;
    if (impact.min !== undefined) return `${impact.min}-${impact.max} dB`;
    return '0 dB';
  };

  const exportToCSV = () => {
    const headers = ['Field', 'Value'];
    const rows = [
      ['Plan ID', plan.id],
      ['Plan Name', plan.name],
      ['Status', plan.status],
      ['Zone', plan.zone],
      ['Budget', `£${plan.budget || 0}`],
      ['Total Cost', `£${plan.totalCost || 0}`],
      ['Timeline', `${plan.timeline || 0} weeks`],
      ['Impact', formatImpact(plan.impact)]
    ];

    if (plan.interventions && plan.interventions.length > 0) {
      rows.push(['', '']);
      rows.push(['INTERVENTIONS', '']);
      plan.interventions.forEach((intervention, idx) => {
        rows.push([`Intervention ${idx + 1}`, intervention.name]);
        rows.push(['  Category', intervention.category]);
        rows.push(['  Cost', formatCost(intervention.cost)]);
        rows.push(['  Impact', formatImpact(intervention.impact)]);
        rows.push(['  Feasibility', `${Math.round((intervention.feasibility || 0) * 100)}%`]);
      });
    }

    if (plan.evidence && plan.evidence.length > 0) {
      rows.push(['', '']);
      rows.push(['EVIDENCE', '']);
      plan.evidence.forEach((evidence, idx) => {
        rows.push([`Evidence ${idx + 1}`, evidence.fileName]);
        rows.push(['  Description', evidence.description || 'No description']);
        rows.push(['  Size', evidence.size || 'Unknown']);
        rows.push(['  Uploaded', evidence.uploadedAt ? new Date(evidence.uploadedAt).toLocaleDateString() : 'N/A']);
      });
    }

    if (plan.notes) {
      rows.push(['', '']);
      rows.push(['NOTES', plan.notes]);
    }

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        typeof cell === 'string' && (cell.includes(',') || cell.includes('\n')) ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = `${plan.name.replace(/\s+/g, '_')}.csv`;
    saveAs(blob, filename);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Mitigation Plan Details', 14, 15);
    doc.setFontSize(16);
    doc.text(plan.name, 14, 25);

    doc.setFontSize(12);
    doc.text(`ID: ${plan.id}`, 14, 35);
    doc.text(`Status: ${plan.status}`, 14, 42);
    doc.text(`Zone: ${plan.zone}`, 14, 49);
    doc.text(`Impact: ${formatImpact(plan.impact)}`, 14, 56);

    doc.setFontSize(14);
    doc.text('Budget Summary', 14, 70);
    doc.setFontSize(11);
    doc.text(`Budget: £${plan.budget || 0}`, 14, 78);
    doc.text(`Total Cost: £${plan.totalCost || 0}`, 14, 85);
    doc.text(`Remaining: £${(plan.budget || 0) - (plan.totalCost || 0)}`, 14, 92);
    doc.text(`Timeline: ${plan.timeline || 0} weeks`, 14, 99);

    let yPosition = 110;

    if (plan.interventions && plan.interventions.length > 0) {
      if (yPosition > doc.internal.pageSize.height - 60) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text('Interventions', 14, yPosition);
      
      const tableColumn = ['Name', 'Category', 'Cost', 'Impact', 'Feasibility'];
      const tableRows = plan.interventions.map(intervention => [
        intervention.name,
        intervention.category,
        formatCost(intervention.cost),
        formatImpact(intervention.impact),
        `${Math.round((intervention.feasibility || 0) * 100)}%`
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: yPosition + 5,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });

      yPosition = doc.lastAutoTable.finalY + 15;
    }

    if (plan.evidence && plan.evidence.length > 0) {
      if (yPosition > doc.internal.pageSize.height - 60) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text('Attached Evidence', 14, yPosition);
      
      const evidenceColumn = ['File Name', 'Description', 'Size', 'Uploaded'];
      const evidenceRows = plan.evidence.map(evidence => [
        evidence.fileName,
        evidence.description || '-',
        evidence.size || '-',
        evidence.uploadedAt ? new Date(evidence.uploadedAt).toLocaleDateString() : '-'
      ]);

      autoTable(doc, {
        head: [evidenceColumn],
        body: evidenceRows,
        startY: yPosition + 5,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });

      yPosition = doc.lastAutoTable.finalY + 15;
    }

    if (plan.notes) {
      if (yPosition > doc.internal.pageSize.height - 40) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text('Notes', 14, yPosition);
      doc.setFontSize(11);
      
      const splitNotes = doc.splitTextToSize(plan.notes, 180);
      doc.text(splitNotes, 14, yPosition + 7);
    }

    const filename = `${plan.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="export-buttons">
      <button onClick={exportToCSV} className="export-csv-btn">
        <span>📊</span> Export CSV
      </button>
      <button onClick={exportToPDF} className="export-pdf-btn">
        <span>📄</span> Export PDF
      </button>
    </div>
  );
};

export default PlanExportButtons;