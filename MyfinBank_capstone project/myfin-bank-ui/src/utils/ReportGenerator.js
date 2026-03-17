import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import autoTable directly

/**
 * MyFin Bank Professional Report Engine
 */
export const generatePDF = (title, headers, rows, fileName) => {
    const doc = jsPDF();
    
    // 1. Add Branding & Header
    doc.setFontSize(20);
    doc.setTextColor(0, 46, 110); 
    doc.text("MyFin Bank • Digital Statement", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Branch: Markapur Operations`, 14, 28);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 33);
    doc.text(`Report Type: ${title}`, 14, 38);

    // 2. Use autoTable(doc, options) instead of doc.autoTable()
    autoTable(doc, {
        startY: 45,
        head: [headers],
        body: rows,
        theme: 'striped',
        headStyles: { 
            fillColor: [0, 46, 110], 
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { top: 45 },
    });

    // 3. Add Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount} - Computer generated document.`, 14, doc.internal.pageSize.height - 10);
    }

    doc.save(`${fileName}.pdf`);
};