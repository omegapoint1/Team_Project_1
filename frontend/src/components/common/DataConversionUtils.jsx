/* Data conversion common component converts passed values to csv or pdf format
for exporting, Unfinished . add error handling and other fixes

*/

//Imports jsPDF library for pdf conversion 
import { jsPDF } from 'jspdf';


/*
  Converts an array of objects to CSV format
  
  @param {Array<Object>} data - Array of objects to convert to CSV
  @returns {string} CSV formatted string
 */
function convertDataToCSV(data) {
  if (!data || data.length === 0) return '';
  
  // Extract headers from the first object's keys
  const headers = Object.keys(data[0]);
  
  //create CSV rows
  const csvRows = [
    headers.join(','), //Header row
    ...data.map(row => 
      headers.map(header => {
        //Escape quotes and wrap in quotes if needed
        const cell = String(row[header] || '');
        return `"${cell.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
}

/*
 Adds data to a PDF document
 */
function addDataToPDF(doc, data, options) {

  
  let yPosition = 30; 
  
  data.forEach((item, index) => {
    doc.setFontSize(12);
    doc.text(`Record ${index + 1}: ${JSON.stringify(item)}`, 20, yPosition);
    yPosition += 10;
    
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20;
    }
  });
}

/*
 Exports data as a CSV file and triggers a download in the browser.
 
 */
export function exportToCSV(data, filename = 'export.csv') {
  const csvContent = convertDataToCSV(data);
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  window.URL.revokeObjectURL(url);
}

/*
 Generates a PDF report from the provided data and downloads it using jspdf

 */
export function exportToPDF(data, options = {}) {
  const doc = new jsPDF({
    orientation: options.orientation || 'portrait',
    unit: options.unit || 'mm',
    format: options.format || 'a4'
  });
  
  doc.setFontSize(16);
  doc.text(options.title || 'Noise Report', 20, 20);
  
  addDataToPDF(doc, data, options);
  
  doc.save(options.filename || 'report.pdf');
}