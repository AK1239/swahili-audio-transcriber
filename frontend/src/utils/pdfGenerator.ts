/** PDF generation utilities */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transcription } from '../types/transcription';
import { Summary } from '../types/summary';
import { formatDateSwahili, formatDateSwahiliShort } from './formatters';
import { getDisplayName } from './filename';
import { formatTranscriptText } from './transcriptFormatter';

/**
 * Configuration for PDF generation
 */
interface PDFConfig {
  pageWidth: number;
  pageHeight: number;
  margin: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
    lightGray: string;
    border: string;
  };
  fonts: {
    title: number;
    heading: number;
    body: number;
    small: number;
  };
}

const PDF_CONFIG: PDFConfig = {
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
  margin: {
    top: 20,
    bottom: 20,
    left: 15,
    right: 15,
  },
  colors: {
    primary: '#2563eb', // Blue
    secondary: '#64748b', // Slate
    text: '#0d101b', // Dark text
    lightGray: '#f1f5f9', // Light gray for backgrounds
    border: '#e2e8f0', // Border color
  },
  fonts: {
    title: 24,
    heading: 16,
    body: 11,
    small: 9,
  },
};

/**
 * Split text into lines that fit within the page width
 */
function splitTextIntoLines(
  doc: jsPDF,
  text: string,
  maxWidth: number,
  fontSize: number = PDF_CONFIG.fonts.body,
): string[] {
  const lines: string[] = [];
  const words = text.split(' ');
  let currentLine = '';

  doc.setFontSize(fontSize);
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = doc.getTextWidth(testLine);
    
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * Add a section header to the PDF
 */
function addSectionHeader(
  doc: jsPDF,
  title: string,
  y: number,
): number {
  const startY = y;
  
  // Section background
  doc.setFillColor(241, 245, 249); // lightGray
  doc.roundedRect(
    PDF_CONFIG.margin.left,
    y,
    PDF_CONFIG.pageWidth - PDF_CONFIG.margin.left - PDF_CONFIG.margin.right,
    8,
    2,
    2,
    'F',
  );
  
  // Section title
  doc.setFontSize(PDF_CONFIG.fonts.heading);
  doc.setTextColor(37, 99, 235); // primary color
  doc.setFont('helvetica', 'bold');
  doc.text(title, PDF_CONFIG.margin.left + 3, y + 5.5);
  
  return startY + 10;
}

/**
 * Add formatted text content to the PDF
 */
function addTextContent(
  doc: jsPDF,
  text: string,
  startY: number,
  maxWidth: number,
): number {
  let y = startY;
  doc.setFontSize(PDF_CONFIG.fonts.body);
  doc.setTextColor(PDF_CONFIG.colors.text);
  doc.setFont('helvetica', 'normal');
  
  // Split text into paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  
  for (const paragraph of paragraphs) {
    const lines = splitTextIntoLines(doc, paragraph.trim(), maxWidth);
    
    for (const line of lines) {
      if (y > PDF_CONFIG.pageHeight - PDF_CONFIG.margin.bottom - 10) {
        doc.addPage();
        y = PDF_CONFIG.margin.top;
      }
      doc.text(line, PDF_CONFIG.margin.left, y);
      y += 6;
    }
    
    // Add spacing between paragraphs
    y += 3;
  }
  
  return y;
}

/**
 * Add action items table to the PDF
 */
function addActionItemsTable(
  doc: jsPDF,
  actionItems: Summary['kazi'],
  startY: number,
): number {
  if (!actionItems || actionItems.length === 0) {
    doc.setFontSize(PDF_CONFIG.fonts.body);
    doc.setTextColor(PDF_CONFIG.colors.secondary);
    doc.text('Hakuna kazi za kufuatilia.', PDF_CONFIG.margin.left, startY);
    return startY + 8;
  }
  
  const tableData = actionItems.map((item) => [
    item.person || '-',
    item.task || '-',
    item.dueDate ? formatDateSwahiliShort(item.dueDate) : '-',
  ]);
  
  autoTable(doc, {
    startY,
    head: [['Mtu', 'Kazi', 'Tarehe ya Mwisho']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [37, 99, 235], // primary color
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: PDF_CONFIG.fonts.body,
    },
    bodyStyles: {
      fontSize: PDF_CONFIG.fonts.body,
      textColor: [13, 16, 27], // text color
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249], // lightGray
    },
    margin: {
      left: PDF_CONFIG.margin.left,
      right: PDF_CONFIG.margin.right,
    },
    styles: {
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: [226, 232, 240], // border color
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 40 },
    },
  });
  
  // Get the final Y position after the table
  const finalY = (doc as any).lastAutoTable?.finalY ?? startY + (tableData.length * 8) + 15;
  return finalY + 5;
}

/**
 * Add a list of items to the PDF
 */
function addListItems(
  doc: jsPDF,
  items: string[],
  startY: number,
  maxWidth: number,
): number {
  if (!items || items.length === 0) {
    doc.setFontSize(PDF_CONFIG.fonts.body);
    doc.setTextColor(PDF_CONFIG.colors.secondary);
    doc.text('Hakuna vitu.', PDF_CONFIG.margin.left, startY);
    return startY + 8;
  }
  
  let y = startY;
  doc.setFontSize(PDF_CONFIG.fonts.body);
  doc.setTextColor(PDF_CONFIG.colors.text);
  doc.setFont('helvetica', 'normal');
  
  for (let i = 0; i < items.length; i++) {
    if (y > PDF_CONFIG.pageHeight - PDF_CONFIG.margin.bottom - 10) {
      doc.addPage();
      y = PDF_CONFIG.margin.top;
    }
    
    const item = items[i];
    const bullet = '•';
    const textX = PDF_CONFIG.margin.left + 5;
    
    // Draw bullet
    doc.text(bullet, PDF_CONFIG.margin.left, y);
    
    // Draw text
    const lines = splitTextIntoLines(doc, item, maxWidth - 5);
    for (const line of lines) {
      doc.text(line, textX, y);
      y += 6;
    }
    
    y += 2; // Spacing between items
  }
  
  return y;
}

/**
 * Generate PDF from transcription and summary data
 */
export function generatePDF(
  transcript: Transcription,
  summary: Summary | null,
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  let y = PDF_CONFIG.margin.top;
  const contentWidth = PDF_CONFIG.pageWidth - PDF_CONFIG.margin.left - PDF_CONFIG.margin.right;
  
  // Header
  doc.setFillColor(37, 99, 235); // primary color
  doc.rect(0, 0, PDF_CONFIG.pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(PDF_CONFIG.fonts.title);
  doc.setFont('helvetica', 'bold');
  const title = getDisplayName(transcript.filename || 'Untitled');
  doc.text(title, PDF_CONFIG.margin.left, 18);
  
  doc.setFontSize(PDF_CONFIG.fonts.small);
  doc.setFont('helvetica', 'normal');
  const dateText = `Tarehe: ${formatDateSwahili(transcript.createdAt)}`;
  doc.text(dateText, PDF_CONFIG.margin.left, 25);
  
  y = 35;
  
  // Full Transcript Section
  if (transcript.transcriptText) {
    y = addSectionHeader(doc, 'Nakala Kamili', y);
    
    if (y > PDF_CONFIG.pageHeight - PDF_CONFIG.margin.bottom - 10) {
      doc.addPage();
      y = PDF_CONFIG.margin.top;
    }
    
    const formattedTranscript = formatTranscriptText(transcript.transcriptText);
    y = addTextContent(doc, formattedTranscript, y, contentWidth);
    y += 5;
  }
  
  // Summary Section
  if (summary) {
    // Brief Summary
    if (summary.muhtasari) {
      y = addSectionHeader(doc, 'Muhtasari Mfupi', y);
      
      if (y > PDF_CONFIG.pageHeight - PDF_CONFIG.margin.bottom - 10) {
        doc.addPage();
        y = PDF_CONFIG.margin.top;
      }
      
      y = addTextContent(doc, summary.muhtasari, y, contentWidth);
      y += 5;
    }
    
    // Action Items
    if (summary.kazi && summary.kazi.length > 0) {
      y = addSectionHeader(doc, 'Kazi za Kufuatilia', y);
      
      if (y > PDF_CONFIG.pageHeight - PDF_CONFIG.margin.bottom - 10) {
        doc.addPage();
        y = PDF_CONFIG.margin.top;
      }
      
      y = addActionItemsTable(doc, summary.kazi, y);
      y += 5;
    }
    
    // Key Decisions
    if (summary.maamuzi && summary.maamuzi.length > 0) {
      y = addSectionHeader(doc, 'Maamuzi Muhimu', y);
      
      if (y > PDF_CONFIG.pageHeight - PDF_CONFIG.margin.bottom - 10) {
        doc.addPage();
        y = PDF_CONFIG.margin.top;
      }
      
      y = addListItems(doc, summary.maamuzi, y, contentWidth);
      y += 5;
    }
    
    // Deferred Topics
    if (summary.masualaYaliyoahirishwa && summary.masualaYaliyoahirishwa.length > 0) {
      y = addSectionHeader(doc, 'Masuala Yaliyoahirishwa', y);
      
      if (y > PDF_CONFIG.pageHeight - PDF_CONFIG.margin.bottom - 10) {
        doc.addPage();
        y = PDF_CONFIG.margin.top;
      }
      
      y = addListItems(doc, summary.masualaYaliyoahirishwa, y, contentWidth);
    }
  }
  
  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(PDF_CONFIG.fonts.small);
    doc.setTextColor(PDF_CONFIG.colors.secondary);
    doc.setFont('helvetica', 'normal');
    const footerText = `Ukurasa ${i} wa ${pageCount}`;
    const footerWidth = doc.getTextWidth(footerText);
    doc.text(
      footerText,
      PDF_CONFIG.pageWidth / 2 - footerWidth / 2,
      PDF_CONFIG.pageHeight - 10,
    );
  }
  
  // Generate filename
  const filename = `${title.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  
  // Save PDF
  doc.save(filename);
}

