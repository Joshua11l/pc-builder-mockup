/**
 * Export Service
 * Handles exporting builds to PDF and CSV formats
 */

/**
 * Export build to CSV format
 * @param {Object} build - Build object
 * @param {string} buildName - Name of the build
 * @param {number} totalPrice - Total price
 * @returns {void} Downloads CSV file
 */
export const exportToCSV = (build, buildName, totalPrice) => {
  try {
    // CSV Headers
    const headers = ['Component Type', 'Name', 'Brand', 'Price', 'Key Specs', 'Amazon Link', 'Newegg Link'];

    // CSV Rows
    const rows = [];

    Object.entries(build).forEach(([type, component]) => {
      if (component) {
        const specs = formatSpecs(component.specs);
        const amazonLink = component.vendor_links?.amazon || 'N/A';
        const neweggLink = component.vendor_links?.newegg || 'N/A';

        rows.push([
          type.toUpperCase(),
          component.name || 'N/A',
          component.brand || 'N/A',
          `$${component.price?.toFixed(2) || '0.00'}`,
          specs,
          amazonLink,
          neweggLink,
        ]);
      }
    });

    // Add total row
    rows.push(['', '', '', '', '', '', '']);
    rows.push(['TOTAL', '', '', `$${totalPrice.toFixed(2)}`, '', '', '']);

    // Convert to CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${buildName.replace(/\s+/g, '_')}_build.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true };
  } catch (error) {
    console.error('CSV export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export build to PDF format (using jsPDF)
 * Note: Requires jsPDF library to be installed
 * @param {Object} build - Build object
 * @param {string} buildName - Name of the build
 * @param {number} totalPrice - Total price
 * @param {Object} compatibilityReport - Compatibility report
 * @returns {void} Downloads PDF file
 */
export const exportToPDF = async (build, buildName, totalPrice, compatibilityReport) => {
  try {
    // Dynamic import of jsPDF (install with: npm install jspdf jspdf-autotable)
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('PC Build Generator', 105, 20, { align: 'center' });

    // Build Name
    doc.setFontSize(16);
    doc.text(buildName, 105, 30, { align: 'center' });

    // Date
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 37, { align: 'center' });

    // Components Table
    const tableData = [];

    Object.entries(build).forEach(([type, component]) => {
      if (component) {
        tableData.push([
          type.toUpperCase(),
          component.name || 'N/A',
          component.brand || 'N/A',
          `$${component.price?.toFixed(2) || '0.00'}`,
          formatSpecs(component.specs),
        ]);
      }
    });

    doc.autoTable({
      startY: 45,
      head: [['Type', 'Name', 'Brand', 'Price', 'Key Specs']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], fontStyle: 'bold' },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 60 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 55 },
      },
    });

    // Total Price
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Price: $${totalPrice.toFixed(2)}`, 14, finalY);

    // Compatibility Report
    if (compatibilityReport) {
      doc.setFontSize(14);
      doc.text('Compatibility Report', 14, finalY + 15);

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');

      // Status
      const status = compatibilityReport.compatible ? '✓ All components compatible' : '✗ Compatibility issues detected';
      const statusColor = compatibilityReport.compatible ? [39, 174, 96] : [231, 76, 60];
      doc.setTextColor(...statusColor);
      doc.text(status, 14, finalY + 23);
      doc.setTextColor(0, 0, 0);

      // Issues
      if (compatibilityReport.issues && compatibilityReport.issues.length > 0) {
        doc.setFont(undefined, 'bold');
        doc.text('Issues:', 14, finalY + 31);
        doc.setFont(undefined, 'normal');
        compatibilityReport.issues.forEach((issue, index) => {
          doc.text(`• ${issue}`, 20, finalY + 38 + (index * 7));
        });
      }

      // Warnings
      if (compatibilityReport.warnings && compatibilityReport.warnings.length > 0) {
        const warningY = finalY + 31 + (compatibilityReport.issues?.length || 0) * 7 + 10;
        doc.setFont(undefined, 'bold');
        doc.text('Warnings:', 14, warningY);
        doc.setFont(undefined, 'normal');
        compatibilityReport.warnings.forEach((warning, index) => {
          doc.text(`• ${warning}`, 20, warningY + 7 + (index * 7));
        });
      }

      // Power Info
      const powerY = finalY + 31 + ((compatibilityReport.issues?.length || 0) + (compatibilityReport.warnings?.length || 0)) * 7 + 20;
      doc.text(`Total TDP: ${compatibilityReport.totalTDP}W`, 14, powerY);
      doc.text(`Recommended PSU: ${compatibilityReport.recommendedPSU}W`, 14, powerY + 7);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text('Generated with PC Build Generator - https://pcbuilder.com', 105, 285, { align: 'center' });

    // Save PDF
    doc.save(`${buildName.replace(/\s+/g, '_')}_build.pdf`);

    return { success: true };
  } catch (error) {
    console.error('PDF export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Format component specs for display
 * @param {Object} specs - Component specifications
 * @returns {string} Formatted specs string
 */
const formatSpecs = (specs) => {
  if (!specs) return 'N/A';

  const keySpecs = [];

  // Extract most important specs based on common fields
  if (specs.cores) keySpecs.push(`${specs.cores} cores`);
  if (specs.threads) keySpecs.push(`${specs.threads} threads`);
  if (specs.base_clock) keySpecs.push(specs.base_clock);
  if (specs.boost_clock) keySpecs.push(`Boost: ${specs.boost_clock}`);
  if (specs.vram) keySpecs.push(specs.vram);
  if (specs.socket) keySpecs.push(`Socket: ${specs.socket}`);
  if (specs.chipset) keySpecs.push(specs.chipset);
  if (specs.ram_type) keySpecs.push(specs.ram_type);
  if (specs.capacity) keySpecs.push(specs.capacity);
  if (specs.speed) keySpecs.push(specs.speed);
  if (specs.wattage) keySpecs.push(`${specs.wattage}W`);
  if (specs.efficiency) keySpecs.push(specs.efficiency);
  if (specs.type) keySpecs.push(specs.type);
  if (specs.tdp) keySpecs.push(`${specs.tdp}W TDP`);

  return keySpecs.join(', ') || 'N/A';
};

/**
 * Copy build to clipboard as text
 * @param {Object} build - Build object
 * @param {string} buildName - Name of the build
 * @param {number} totalPrice - Total price
 * @returns {Promise} Success or error
 */
export const copyToClipboard = async (build, buildName, totalPrice) => {
  try {
    let text = `${buildName}\n`;
    text += `${'='.repeat(buildName.length)}\n\n`;

    Object.entries(build).forEach(([type, component]) => {
      if (component) {
        text += `${type.toUpperCase()}: ${component.name} - $${component.price?.toFixed(2)}\n`;
      }
    });

    text += `\nTOTAL: $${totalPrice.toFixed(2)}\n`;
    text += `\nGenerated with PC Build Generator`;

    await navigator.clipboard.writeText(text);

    return { success: true };
  } catch (error) {
    console.error('Clipboard copy error:', error);
    return { success: false, error: error.message };
  }
};
