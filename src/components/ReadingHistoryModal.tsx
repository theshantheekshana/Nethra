import React, { useState } from 'react';
import { ReadingHistoryItem } from '../services/storageService';
import { CompleteReading } from '../types/reading';
import {
  generateAndDownloadPdf,
  getPdfFilename,
} from '../pdf/pdfGenerator';
import {
  Search,
  Trash2,
  Download,
  FolderOpen,
  Calendar,
  User,
  X,
  FileText,
  Clock,
  Sparkles,
  DownloadCloud,
  UploadCloud,
} from 'lucide-react';

interface ReadingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ReadingHistoryItem[];
  onOpenReading: (reading: CompleteReading) => void;
  onDeleteReading: (id: string) => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
}

export const ReadingHistoryModal: React.FC<ReadingHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onOpenReading,
  onDeleteReading,
  onExportJson,
  onImportJson,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = history.filter(
    (item) =>
      item.customerLegalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerCommonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.birthDate.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm no-print">
      <div className="w-full max-w-4xl max-h-[85vh] rounded-2xl border border-[#D4AF37]/30 bg-[#0A0E1D] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#080B14]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#FFE29F]" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-[#FFE29F]">
                OPERATOR READING HISTORY
              </h3>
              <p className="font-sinhala text-xs text-slate-400">
                පෙර සකස් කරන ලද සියලුම සේවාදායක වාර්තා ලැයිස්තුව ({history.length})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onExportJson}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 font-sinhala transition cursor-pointer"
              title="දත්ත සංචිතය Backup එකක් ලෙස බාගත කරන්න"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Backup</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 bg-[#090D1A]">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="සේවාදායකයාගේ නම හෝ උපන් දිනය මගින් සොයන්න..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900/90 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] font-sinhala"
            />
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-sinhala">
              <Sparkles className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold">කිසිදු වාර්තාවක් හමු නොවීය</p>
              <p className="text-xs text-slate-500 mt-1">නව වාර්තාවක් සකස් කළ පසු එය ස්වයංක්‍රීයව මෙහි තැන්පත් වේ.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-800 bg-[#0E1326]/60 hover:bg-[#0E1326] hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#FFE29F] tracking-wide uppercase">
                      {item.customerLegalName}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({item.customerCommonName})
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#FFE29F] font-cinzel">
                      LP #{item.lifePathNumber}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-sinhala">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>උපන් දිනය: {item.birthDate}</span>
                    </span>
                    {item.birthTime && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>වේලාව: {item.birthTime}</span>
                      </span>
                    )}
                    <span className="text-slate-500">•</span>
                    <span>සැකසූ දිනය: {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      onOpenReading(item.readingData);
                      onClose();
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-xs font-semibold text-[#FFE29F] transition cursor-pointer font-sinhala"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>විවෘත කරන්න</span>
                  </button>

                  <button
                    onClick={() => {
                      onDeleteReading(item.id);
                    }}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-900 transition cursor-pointer"
                    title="මකා දමන්න"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#080B14] text-center text-[11px] text-slate-500 font-sinhala">
          NETHRA Internal Storage • දත්ත බ්‍රවුසරයේ සුරක්ෂිතව ගබඩා කර ඇත.
        </div>
      </div>
    </div>
  );
};
