import React, { useState, useEffect } from 'react';
import { CustomerInput, CompleteReading } from './types/reading';
import { requestNumerologyReading, checkServerHealth } from './services/aiService';
import {
  getHistory,
  saveReadingToHistory,
  deleteReadingFromHistory,
  ReadingHistoryItem,
  exportHistoryJson,
} from './services/storageService';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ReportViewer } from './components/ReportViewer';
import { ReadingHistoryModal } from './components/ReadingHistoryModal';
import { Sparkles, Shield, Compass, BookOpen, Star } from 'lucide-react';

export default function App() {
  const [currentReading, setCurrentReading] = useState<CompleteReading | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [aiActive, setAiActive] = useState<boolean>(false);

  // Initialize history and check server health
  useEffect(() => {
    setHistory(getHistory());
    checkServerHealth().then(res => setAiActive(res.aiEnabled));
  }, []);

  const handleGenerateReading = async (input: CustomerInput) => {
    try {
      setIsLoading(true);
      setLoadingMessage('මූලික අංක 8 ගණනය කරමින් පවතී...');

      setTimeout(() => {
        setLoadingMessage('පරිච්ඡේද 22 ක සම්පූර්ණ ජීවිත විග්‍රහය සකස් කරමින් පවතී...');
      }, 700);

      const reading = await requestNumerologyReading(input);

      // Auto-save to operator history
      saveReadingToHistory(reading);
      setHistory(getHistory());
      setCurrentReading(reading);
      setIsSaved(true);
    } catch (err) {
      console.error('Error generating reading:', err);
      alert('වාර්තාව සකස් කිරීමේදී දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleNewReading = () => {
    setCurrentReading(null);
    setIsSaved(false);
  };

  const handleSaveReading = () => {
    if (currentReading) {
      saveReadingToHistory(currentReading);
      setHistory(getHistory());
      setIsSaved(true);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    deleteReadingFromHistory(id);
    setHistory(getHistory());
    if (currentReading && currentReading.id === id) {
      setIsSaved(false);
    }
  };

  const handleExportHistory = () => {
    const jsonStr = exportHistoryJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NETHRA_Operator_History_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportHistory = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            localStorage.setItem('nethra_reading_history_v1', JSON.stringify(parsed));
            setHistory(getHistory());
            alert('දත්ත සාර්ථකව ආනයනය කරන ලදී!');
          }
        } catch (err) {
          alert('වලංගු නොවන JSON ගොනුවකි.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-[#E6EAF2] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#FFF5D1]">
      {/* Top Navigation */}
      <Header
        onNewReading={handleNewReading}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        historyCount={history.length}
        aiActive={aiActive}
      />

      {/* Main Body */}
      <main className="flex-1 pb-16">
        {!currentReading ? (
          <div>
            {/* Operator Welcome Banner */}
            <div className="no-print max-w-4xl mx-auto pt-8 px-4 text-center">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 mb-3">
                <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[11px] font-bold text-[#FFE29F] tracking-widest uppercase">
                  OPERATOR WORKFLOW
                </span>
              </div>
              <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFE29F] via-[#D4AF37] to-[#B89222]">
                Welcome to NETHRA
              </h1>
              <p className="font-sinhala text-sm sm:text-base text-slate-300 mt-2 font-medium">
                "ඔබේ අංකවලින් ඔබේ මාවත හඳුනාගන්න"
              </p>
              <p className="font-sinhala text-xs text-slate-400 mt-1 max-w-lg mx-auto">
                සේවාදායකයාගේ මූලික තොරතුරු 4 පමණක් ඇතුළත් කර සම්පූර්ණ පිටු 4 ක Sinhala Life Reading PDF වාර්තාව එක ක්ලික් එකකින් ලබාගන්න.
              </p>
            </div>

            {/* The Sole Input Form */}
            <InputForm
              onSubmit={handleGenerateReading}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
            />
          </div>
        ) : (
          <ReportViewer
            reading={currentReading}
            onGenerateAgain={handleNewReading}
            onSaveReading={handleSaveReading}
            isSaved={isSaved}
          />
        )}
      </main>

      {/* Operator History Modal */}
      <ReadingHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onOpenReading={(reading) => setCurrentReading(reading)}
        onDeleteReading={handleDeleteHistoryItem}
        onExportJson={handleExportHistory}
        onImportJson={handleImportHistory}
      />

      {/* Operator Footer */}
      <footer className="no-print border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-400 font-sinhala">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-cinzel font-bold text-[#D4AF37]">NETHRA</span>
            <span>• පුද්ගලික අභ්‍යන්තර මෙහෙයුම් පද්ධතිය (Internal Operator Only)</span>
          </div>
          <div>
            සියලුම හිමිකම් ඇවිරිණි © {new Date().getFullYear()} NETHRA
          </div>
        </div>
      </footer>
    </div>
  );
}
