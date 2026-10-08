import React from 'react';
import { Sparkles, History, PlusCircle, ShieldCheck, Compass } from 'lucide-react';

interface HeaderProps {
  onNewReading: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  aiActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewReading,
  onOpenHistory,
  historyCount,
  aiActive,
}) => {
  return (
    <header className="no-print border-b border-[#D4AF37]/20 bg-[#060913]/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewReading}>
          <div className="w-10 h-10 rounded-xl border border-[#D4AF37]/50 bg-gradient-to-br from-[#1E1145] to-[#0A0F1D] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Compass className="w-5 h-5 text-[#FFE29F]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-cinzel text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFE29F] via-[#D4AF37] to-[#E6CA65]">
                NETHRA
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-purple-500/30 bg-purple-950/40 text-purple-300">
                OPERATOR
              </span>
            </div>
            <p className="font-sinhala text-[11px] text-[#FFE29F]/80 font-medium">
              ඔබේ අංකවලින් ඔබේ මාවත හඳුනාගන්න
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Engine indicator */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/60 text-[11px] text-slate-300">
            <span className={`w-2 h-2 rounded-full ${aiActive ? 'bg-emerald-400' : 'bg-[#D4AF37]'}`} />
            <span>{aiActive ? 'Gemini AI Enhanced' : 'Core Numerology Engine'}</span>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-200 transition font-medium"
            title="වාර්තා ඉතිහාසය"
          >
            <History className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-sinhala">ඉතිහාසය</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#D4AF37]/20 text-[#FFE29F] text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* New Reading Button */}
          <button
            onClick={onNewReading}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg border border-[#D4AF37]/50 bg-gradient-to-r from-[#D4AF37] to-[#B38F1E] hover:from-[#E5C148] hover:to-[#C49E28] text-slate-950 font-bold text-xs shadow-md shadow-[#D4AF37]/10 transition font-sinhala"
          >
            <PlusCircle className="w-4 h-4" />
            <span>නව Life Reading</span>
          </button>
        </div>
      </div>
    </header>
  );
};
