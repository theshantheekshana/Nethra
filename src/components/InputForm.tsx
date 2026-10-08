import React, { useState } from 'react';
import { CustomerInput } from '../types/reading';
import { Sparkles, Calendar, Clock, User, CheckCircle2, AlertCircle } from 'lucide-react';

interface InputFormProps {
  onSubmit: (input: CustomerInput) => void;
  isLoading: boolean;
  loadingMessage?: string;
}

export const InputForm: React.FC<InputFormProps> = ({
  onSubmit,
  isLoading,
  loadingMessage,
}) => {
  const [legalName, setLegalName] = useState('');
  const [commonName, setCommonName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!legalName.trim()) {
      setError('කරුණාකර උප්පැන්න සහතිකයේ සඳහන් සම්පූර්ණ නම (English Block Capitals) ඇතුළත් කරන්න.');
      return;
    }

    if (!commonName.trim()) {
      setError('කරුණාකර දෛනිකව බහුලව භාවිත කරන නම ඇතුළත් කරන්න.');
      return;
    }

    if (!birthDate.trim()) {
      setError('කරුණාකර උපන් දිනය ඇතුළත් කරන්න.');
      return;
    }

    onSubmit({
      legalName: legalName.trim().toUpperCase(),
      commonName: commonName.trim().toUpperCase(),
      birthDate: birthDate.trim(),
      birthTime: birthTime.trim() || undefined,
    });
  };

  // Preset sample data helper for quick testing
  const loadSampleData = () => {
    setLegalName('KAMAL PERERA');
    setCommonName('KAMAL');
    setBirthDate('2004-08-15');
    setBirthTime('10:45');
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto my-8 px-4">
      <div className="p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-b from-[#0C1024] via-[#080B18] to-[#060913] shadow-2xl relative">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Title & Operator Instructions */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-semibold text-[#FFE29F] uppercase tracking-wider">
              OPERATOR DATA ENTRY
            </span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFE29F] via-[#D4AF37] to-[#B89222]">
            New Life Reading
          </h2>
          <p className="font-sinhala text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
            සේවාදායකයාගෙන් ලබාගත් මූලික තොරතුරු 4 පමණක් ඇතුළත් කරන්න. ඉතිරි සියලු අංක විද්‍යාත්මක විශ්ලේෂණයන් NETHRA පද්ධතිය ස්වයංක්‍රීයව සිදුකරනු ඇත.
          </p>

          <button
            type="button"
            onClick={loadSampleData}
            className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 rounded-md border border-slate-700 bg-slate-800/60 hover:bg-slate-700/80 text-[11px] text-slate-300 font-sinhala transition"
          >
            <span>නියැදි දත්ත පුරවන්න (Kamal Perera - 15/08/2004)</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg border border-red-500/40 bg-red-950/30 flex items-start space-x-2 text-xs text-red-200 font-sinhala">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* FIELD 1: FULL LEGAL NAME */}
          <div className="space-y-1.5">
            <label className="block font-sinhala text-xs sm:text-sm font-semibold text-slate-200">
              1. උප්පැන්න සහතිකයේ සඳහන් සම්පූර්ණ නම
              <span className="text-[#D4AF37] ml-1">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value.toUpperCase())}
                placeholder="උදා: KAMAL PERERA"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 placeholder-slate-500 text-sm font-mono tracking-wider focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition uppercase"
              />
            </div>
            <p className="font-sinhala text-[11px] text-slate-400">
              උප්පැන්න සහතිකයේ සඳහන් සම්පූර්ණ නම English Block Capitals වලින් ඇතුළත් කරන්න. (Destiny, Soul Urge, Personality ගණනය සඳහා භාවිත වේ).
            </p>
          </div>

          {/* FIELD 2: COMMON / CALLING NAME */}
          <div className="space-y-1.5">
            <label className="block font-sinhala text-xs sm:text-sm font-semibold text-slate-200">
              2. දැනට ඔබ බහුලව භාවිත කරන නම
              <span className="text-[#D4AF37] ml-1">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={commonName}
                onChange={(e) => setCommonName(e.target.value.toUpperCase())}
                placeholder="උදා: KAMAL"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 placeholder-slate-500 text-sm font-mono tracking-wider focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition uppercase"
              />
            </div>
            <p className="font-sinhala text-[11px] text-slate-400">
              සමාජයේ, රැකියාවේ හෝ මිතුරන් අතර ඔබව හඳුන්වන නම. (උප්පැන්න නාමය සහ භාවිත නාමය සංසන්දනය සඳහා භාවිත වේ).
            </p>
          </div>

          {/* FIELD 3: DATE OF BIRTH */}
          <div className="space-y-1.5">
            <label className="block font-sinhala text-xs sm:text-sm font-semibold text-slate-200">
              3. උපන් දිනය (Date of Birth)
              <span className="text-[#D4AF37] ml-1">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition"
              />
            </div>
            <p className="font-sinhala text-[11px] text-slate-400">
              Life Path Number, Birthday Number, Personal Year සහ වාර්ෂික චක්‍ර ගණනය සඳහා භාවිත කෙරේ.
            </p>
          </div>

          {/* FIELD 4: BIRTH TIME (OPTIONAL) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block font-sinhala text-xs sm:text-sm font-semibold text-slate-200">
                4. උපන් වේලාව (Birth Time)
              </label>
              <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                විකල්පයි (OPTIONAL)
              </span>
            </div>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900/90 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition"
              />
            </div>
            <p className="font-sinhala text-[11px] text-slate-400">
              සාමාන්‍ය අංක විද්‍යාව සඳහා උපන් දිනය ප්‍රමාණවත් වේ. උපන් වේලාව ලබාදී ඇත්නම් අමතර time-based interpretation සඳහා භාවිත කළ හැක.
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl border border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] via-[#E6CA65] to-[#B89222] hover:from-[#E5C148] hover:to-[#C49E28] text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-[#D4AF37]/20 transition flex items-center justify-center space-x-2 font-sinhala cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>{loadingMessage || 'සම්පූර්ණ Life Reading එක සකස් කරමින් පවතී...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>සම්පූර්ණ Life Reading එක සකස් කරන්න</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
