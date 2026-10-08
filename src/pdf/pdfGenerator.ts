import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CompleteReading } from '../types/reading';

export function getPdfFilename(customerName: string): string {
  const sanitized = customerName
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^A-Za-z0-9_]/g, '');
  return `NETHRA_${sanitized || 'Customer'}_Life_Reading.pdf`;
}

export async function generateAndDownloadPdf(
  reading: CompleteReading,
  onProgress?: (status: string, percentage: number) => void
): Promise<void> {
  const container = document.getElementById('nethra-pdf-container');
  if (!container) {
    throw new Error('PDF container not found');
  }

  const pages = Array.from(container.querySelectorAll('.a4-page')) as HTMLElement[];
  if (pages.length === 0) {
    throw new Error('No pages found to generate PDF');
  }

  onProgress?.('PDF පිටු සකස් කරමින් පවතී...', 5);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = 210;
  const pdfHeight = 297;

  for (let i = 0; i < pages.length; i++) {
    const pageEl = pages[i];
    const pct = Math.round(10 + ((i + 1) / pages.length) * 80);
    onProgress?.(`පිටුව ${i + 1} / ${pages.length} සකස් කරමින් පවතී...`, pct);

    // Render with high resolution scale
    const canvas = await html2canvas(pageEl, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#060913',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  }

  onProgress?.('PDF ගොනුව බාගත කිරීමට සූදානම් කෙරේ...', 95);

  const filename = getPdfFilename(reading.customerInput.legalName);
  pdf.save(filename);

  onProgress?.('සාර්ථකව සම්පූර්ණ කරන ලදී!', 100);
}

export function triggerPrintDialog(): void {
  window.print();
}
