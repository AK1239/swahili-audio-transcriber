/** PDF export service */
import { Transcription } from '../types/transcription';
import { Summary } from '../types/summary';
import { generatePDF } from '../utils/pdfGenerator';

export const pdfService = {
  /**
   * Export transcription and summary as PDF
   */
  exportToPDF(transcript: Transcription, summary: Summary | null): void {
    try {
      generatePDF(transcript, summary);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  },
};

