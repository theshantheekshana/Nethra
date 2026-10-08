import React, { useState } from 'react';
import { CompleteReading } from '../types/reading';
import { PdfDocument } from './pdf/PdfDocument';
import {
  generateAndDownloadPdf,
  triggerPrintDialog,
  getPdfFilename,
} from '../pdf/pdfGenerator';
import {
  Download,
  Printer,
  Eye,
  RefreshCw,
  BookmarkCheck,
  CheckCircle2,
  Share2,
  ChevronRight,
  Sparkles,
  BookOpen,
  Layers,
  Search,
} from 'lucide-react';

interface ReportViewerProps {
  reading: CompleteReading;
  onGenerateAgain: () => void;
  onSaveReading: () => void;
  isSaved: boolean;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  reading,
  onGenerateAgain,
  onSaveReading,
  isSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'interactive' | 'pdfPreview'>('interactive');
  const [selectedSectionId, setSelectedSectionId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  const filename = getPdfFilename(reading.customerInput.legalName);

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      setDownloadStatus('PDF සකස් වෙමින් පවතී...');
      await generateAndDownloadPdf(reading, (status, pct) => {
        setDownloadStatus(`${status} (${pct}%)`);
      });
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadStatus(null);
      }, 1000);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('PDF බාගත කිරීමේදී දෝෂයක් සිදුවිය. මුද්‍රණ (Print to PDF) විකල්පයද භාවිත කළ හැක.');
      setIsDownloading(false);
      setDownloadStatus(null);
    }
  };

  const currentSection = reading.sections.find(s => s.id === selectedSectionId) || reading.sections[0];

  const filteredSections = reading.sections.filter(s =>
    s.titleSi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sectionNumber.toString().includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* SUCCESS BANNER & CONTROL BAR */}
      <div className="no-print mb-6 p-5 sm:p-6 rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-r from-[#140E2D] via-[#0D1226] to-[#0A0D1A] shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-sinhala text-lg sm:text-xl font-bold text-slate-100">
                  ඔබගේ NETHRA Life Reading එක සාර්ථකව සකස් කර ඇත.
                </h2>
              </div>
              <p className="font-sinhala text-xs text-slate-300 mt-1">
                සේවාදායකයා: <span className="font-bold text-[#FFE29F] uppercase">{reading.customerInput.legalName}</span> ({reading.customerInput.commonName}) • උපන් දිනය: {reading.customerInput.birthDate} • ගොනුව: <span className="font-mono text-[#D4AF37]">{filename}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Download PDF button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#B38F1E] hover:from-[#E5C148] hover:to-[#C49E28] text-slate-950 font-bold text-xs shadow-md shadow-[#D4AF37]/20 transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span className="font-sinhala">{isDownloading ? (downloadStatus || 'බාගත වෙමින්...') : 'Download PDF'}</span>
            </button>

            {/* Print / Save as PDF */}
            <button
              onClick={triggerPrintDialog}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
              title="බ්‍රවුසරය හරහා Direct Vector PDF ලෙස සුරකින්න හෝ මුද්‍රණය කරන්න"
            >
              <Printer className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-sinhala">Print / Save as PDF</span>
            </button>

            {/* Save Reading */}
            <button
              onClick={onSaveReading}
              className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                isSaved
                  ? 'border-emerald-600/50 bg-emerald-950/40 text-emerald-300'
                  : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-[#FFE29F]" />
              <span className="font-sinhala">{isSaved ? 'සුරකින ලදී' : 'Save Reading'}</span>
            </button>

            {/* Generate Again */}
            <button
              onClick={onGenerateAgain}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
              <span className="font-sinhala">Generate Again</span>
            </button>
          </div>
        </div>

        {/* View mode switcher */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('interactive')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'interactive'
                  ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FFE29F]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="font-sinhala">කොටස් වශයෙන් විමර්ශනය (Interactive View)</span>
            </button>

            <button
              onClick={() => setActiveTab('pdfPreview')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'pdfPreview'
                  ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FFE29F]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="font-sinhala">සම්පූර්ණ A4 PDF පිටු පූර්වදර්ශනය (Full PDF Preview)</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-sinhala hidden sm:block">
            සම්පූර්ණ පරිච්ඡේද 22 ක් අන්තර්ගතයි
          </div>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE EXPLORER VIEW */}
      {activeTab === 'interactive' && (
        <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar: All 22 Sections List */}
          <div className="lg:col-span-4 bg-[#0A0E1D] p-4 rounded-2xl border border-slate-800 self-start">
            <div className="mb-3">
              <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block font-cinzel">
                TABLE OF CONTENTS
              </span>
              <h3 className="font-sinhala text-sm font-bold text-slate-200">
                අංක විද්‍යාත්මක වාර්තාවේ කොටස් 22
              </h3>
            </div>

            {/* Quick search input */}
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="කොටස් සොයන්න..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] font-sinhala"
              />
            </div>

            {/* Section links */}
            <div className="space-y-1 max-h-[620px] overflow-y-auto pr-1 text-xs">
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`w-full text-left p-2.5 rounded-lg transition flex items-center justify-between cursor-pointer font-sinhala ${
                    selectedSectionId === sec.id
                      ? 'bg-[#1A1430] border border-[#D4AF37]/40 text-[#FFE29F] font-bold shadow-sm'
                      : 'hover:bg-slate-900/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="font-cinzel text-[10px] text-slate-500 font-bold w-5">
                      #{sec.sectionNumber}
                    </span>
                    <span className="truncate">{sec.titleSi}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${selectedSectionId === sec.id ? 'text-[#D4AF37]' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Main Area: Detailed Section Content */}
          <div className="lg:col-span-8 bg-[#0C1024] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl font-sinhala">
            <div className="border-b border-slate-800 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider font-cinzel">
                  SECTION {currentSection.sectionNumber} OF 22
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#FFE29F] mt-0.5">
                  {currentSection.titleSi}
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  {currentSection.titleEn}
                </p>
              </div>

              {currentSection.subtitleSi && (
                <span className="px-3 py-1 rounded-full border border-slate-700 bg-slate-900/60 text-xs text-slate-300 self-start sm:self-auto">
                  {currentSection.subtitleSi}
                </span>
              )}
            </div>

            {/* Summary card */}
            <div className="mb-6 p-4 rounded-xl border border-[#D4AF37]/30 bg-[#120E26]/60">
              <span className="text-[10px] text-[#FFE29F] font-bold uppercase tracking-wider block font-cinzel mb-1">
                EXECUTIVE SUMMARY
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {currentSection.summarySi}
              </p>
            </div>

            {/* Paragraphs */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentSection.contentSi.map((para, i) => (
                <p key={i} className="p-3.5 rounded-lg bg-[#090D1A]/70 border border-slate-800/80">
                  {para}
                </p>
              ))}
            </div>

            {/* Table data if present */}
            {currentSection.tableData && currentSection.tableData.length > 0 && (
              <div className="mt-6 overflow-hidden rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#140E2D] text-[#FFE29F]">
                    <tr>
                      <th className="p-3 font-semibold">විෂය / තේමාව</th>
                      <th className="p-3 font-semibold">අගය / විග්‍රහය</th>
                      <th className="p-3 font-semibold">සටහන්</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-[#0A0E1D]">
                    {currentSection.tableData.map((row, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-medium text-slate-200">{row.label}</td>
                        <td className="p-3 text-[#FFE29F] font-bold">{row.value}</td>
                        <td className="p-3 text-slate-400">{row.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Navigation buttons at bottom of section */}
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                disabled={currentSection.sectionNumber <= 1}
                onClick={() => setSelectedSectionId(prev => Math.max(1, prev - 1))}
                className="px-3.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ← පෙර කොටස
              </button>

              <span className="text-slate-500 font-cinzel">
                {currentSection.sectionNumber} / 22
              </span>

              <button
                disabled={currentSection.sectionNumber >= 22}
                onClick={() => setSelectedSectionId(prev => Math.min(22, prev + 1))}
                className="px-3.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ඊළඟ කොටස →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL A4 PDF DOCUMENT PREVIEW & PRINT ENGINE */}
      <div className={`mt-4 ${activeTab === 'pdfPreview' ? 'block' : 'hidden print:block'}`}>
        <div className="no-print mb-4 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>මෙම පිටු 4 සෘජුවම A4 ප්‍රමාණයෙන් සකස් කර ඇති අතර, Download PDF ක්ලික් කිරීමෙන් මෙම ගොනුව බාගත වේ.</span>
          <button
            onClick={handleDownloadPdf}
            className="px-3 py-1 rounded bg-[#D4AF37] text-slate-950 font-bold text-xs"
          >
            Download Now
          </button>
        </div>
        <PdfDocument reading={reading} />
      </div>
    </div>
  );
};
