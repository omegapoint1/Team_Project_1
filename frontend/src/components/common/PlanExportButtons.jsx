import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

const PlanExportButtons = ({ plan }) => {
  if (!plan) return null;

  // Export plan data as CSV file
  const exportToCSV = () => {
    //Define CSV structure 
    const headers = ['Field', 'Value'];
    const rows = [
      ['Plan ID', plan.id],
      ['Plan Name', plan.name],
      ['Status', plan.status],
      ['Zone', plan.zone],
      ['Budget', `£${plan.budget}`],
      ['Total Cost', `£${plan.totalCost}`],
      ['Timeline', `${plan.timeline} weeks`]
    ];

    //build CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
      ).join(','))
    ].join('\n');

    //Create downloadable file
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = `${plan.name.replace(/\s+/g, '_')}.csv`;
    
    //Trigger browser download
    saveAs(blob, filename);
  };

  // Export plan data as PDF document
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

    //Budget summary
    doc.setFontSize(14);
    doc.text('Budget Summary', 14, 63);
    doc.setFontSize(11);
    doc.text(`Budget: £${plan.budget}`, 14, 71);
    doc.text(`Total Cost: £${plan.totalCost}`, 14, 78);
    doc.text(`Remaining: £${plan.budget - plan.totalCost}`, 14, 85);

    // Add interventions table if any exist
    if (plan.interventions?.length > 0) {
      if (85 > doc.internal.pageSize.height - 40) {
        doc.addPage();
      }
      
      //Set the starting position based on current page
      const startY = doc.internal.getCurrentPageInfo().pageNumber === 1 ? 100 : 20;
      
      doc.setFontSize(14);
      doc.text('Interventions', 14, startY);
      
      //Prepare table data
      const tableColumn = ['Name', 'Category', 'Cost', 'Impact', 'Feasibility'];
      const tableRows = plan.interventions.map(intervention => [
        intervention.name,
        intervention.category,
        `£${intervention.costRange?.min}-${intervention.costRange?.max}`,
        `${intervention.impactRange?.min}-${intervention.impactRange?.max} dB`,
        `${Math.round(intervention.feasibility * 100)}%`
      ]);

      //Generate table with basic styling
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: startY + 5,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });
    }

    // evidence table if any evidencw exists
    if (plan.evidence?.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Attached Evidence', 14, 15);
      
      const evidenceColumn = ['File Name', 'Descriprtion', 'Size', 'Uploaded'];
      const evidenceRows = plan.evidence.map(evidence => [
        evidence.fileName,
        //evidence.description || '-' - //To add to metadata
        //new Date(evidence.uploadedData).toLocaleDateString()
      ]);

      autoTable(doc, {
        head: [evidenceColumn],
        body: evidenceRows,
        startY: 25,
        styles: { fontSize: 9 },
      });
    }

    //add notes
    if (plan.notes && plan.notes.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Notes', 14, 15);
      doc.setFontSize(11);
      
      //display each note with numbering
      let yPosition = 25;
      plan.notes.forEach((noteItem, index) => {
        const noteText = `Note ${index + 1}: ${noteItem.note}`;
        const splitNotes = doc.splitTextToSize(noteText, 180);
        doc.text(splitNotes, 14, yPosition);
        
        // Move down for next note
        yPosition += (splitNotes.length * 7) + 5;
        if (yPosition > doc.internal.pageSize.height - 20) {
          doc.addPage();
          yPosition = 20;
        }
      });
    }

    //Generate filename and trigger PDF saving
    const filename = `${plan.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);    // compiles all content into PDF and triggers download

  };

  return (
    <div >
      <button
        onClick={exportToCSV}

      >
        <span>📊</span> Export CSV
      </button>
      <button
        onClick={exportToPDF}
        
      >
        <span>📄</span> Export PDF
      </button>
    </div>
  );
};

export default PlanExportButtons;