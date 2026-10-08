import React from 'react';
import { CompleteReading } from '../../types/reading';
import {
  Sparkles,
  Compass,
  Star,
  Award,
  Calendar,
  Clock,
  Heart,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface PdfDocumentProps {
  reading: CompleteReading;
}

export const PdfDocument: React.FC<PdfDocumentProps> = ({ reading }) => {
  const { customerInput, profile, sections, timeline, luckyFactors, nameComparison, summary } = reading;
  const formattedDate = new Date(reading.createdAt).toLocaleDateString('si-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Reusable header component for pages 2, 3, 4
  const PageHeader: React.FC<{ pageTitle: string; pageNum: number }> = ({ pageTitle, pageNum }) => (
    <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2.5 mb-4">
      <div className="flex items-center space-x-2">
        <span className="font-cinzel text-xs font-black tracking-widest text-[#D4AF37]">NETHRA</span>
        <span className="text-[10px] text-slate-500">•</span>
        <span className="font-sinhala text-[11px] font-medium text-slate-300">පුද්ගලික අංක විද්‍යාත්මක ජීවිත කියවීම</span>
        <span className="text-[10px] text-slate-500">•</span>
        <span className="font-sinhala text-[11px] text-[#FFE29F] font-bold">{pageTitle}</span>
      </div>
      <div className="text-right flex items-center space-x-3">
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono">
          {customerInput.legalName}
        </span>
        <span className="font-cinzel text-[10px] text-[#D4AF37] font-bold px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30">
          PAGE {pageNum} OF 4
        </span>
      </div>
    </div>
  );

  // Reusable footer component
  const PageFooter: React.FC<{ pageNum: number }> = ({ pageNum }) => (
    <div className="absolute bottom-5 left-10 right-10 flex items-center justify-between border-t border-[#D4AF37]/20 pt-2 text-[10px] text-slate-400 font-sinhala">
      <div className="flex items-center space-x-2">
        <span className="font-cinzel font-bold text-[#D4AF37]">NETHRA</span>
        <span>• ඔබේ අංකවලින් ඔබේ මාවත හඳුනාගන්න</span>
      </div>
      <div className="flex items-center space-x-3">
        <span>රහස්‍ය ලියවිල්ලකි • {formattedDate}</span>
        <span className="font-cinzel text-[#D4AF37] font-bold">PAGE {pageNum} OF 4</span>
      </div>
    </div>
  );

  return (
    <div id="nethra-pdf-container" className="flex flex-col items-center bg-slate-950 text-slate-100 font-sans">

      {/* ========================================================================= */}
      {/* PAGE 1 OF 4: LUXURY COVER & CORE NUMEROLOGY PROFILE (SECTION 1)          */}
      {/* ========================================================================= */}
      <div className="a4-page p-8 flex flex-col justify-between bg-gradient-to-b from-[#060913] via-[#0E0B20] to-[#060913] border-4 border-[#D4AF37]/40 relative">
        {/* Decorative corner borders */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]" />

        <div>
          {/* Top Brand Banner */}
          <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3 mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg border border-[#D4AF37]/60 bg-[#D4AF37]/10 flex items-center justify-center">
                <Compass className="w-5 h-5 text-[#FFE29F]" />
              </div>
              <div>
                <h1 className="font-cinzel text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFE29F] via-[#D4AF37] to-[#B38F1E]">
                  NETHRA
                </h1>
                <p className="font-sinhala text-[10px] text-[#FFE29F] font-medium leading-none">
                  "ඔබේ අංකවලින් ඔබේ මාවත හඳුනාගන්න"
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#FFE29F] block">
                MASTER NUMEROLOGY READING
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                ලියාපදිංචි වාර්තා අංකය: {reading.id}
              </span>
            </div>
          </div>

          {/* Customer Metadata Card */}
          <div className="p-3.5 rounded-xl border border-[#D4AF37]/30 bg-[#0B0F20]/90 grid grid-cols-4 gap-3 mb-4 text-xs font-sinhala">
            <div>
              <span className="text-[10px] text-slate-400 block">උප්පැන්න සහතිකයේ නම:</span>
              <span className="font-bold text-[#FFE29F] uppercase text-xs block font-mono truncate">{customerInput.legalName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">දෛනික භාවිත නම:</span>
              <span className="font-bold text-slate-200 uppercase text-xs block font-mono">{customerInput.commonName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">උපන් දිනය (DOB):</span>
              <span className="font-bold text-slate-200 text-xs block">{customerInput.birthDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">උපන් වේලාව / දිනය:</span>
              <span className="font-semibold text-slate-300 text-xs block">{customerInput.birthTime || 'සඳහන් නොවේ'} • {formattedDate}</span>
            </div>
          </div>

          {/* Section 1: The Master 8-Card Numerology Matrix */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-sinhala text-xs font-bold text-[#FFE29F] flex items-center space-x-1.5">
                <Star className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>කොටස 1: පුද්ගලික අංක විද්‍යාත්මක පැතිකඩ (Core Numerology Profile)</span>
              </h2>
              <span className="font-cinzel text-[10px] text-[#D4AF37] font-semibold">
                8 PRIMARY NUMEROLOGICAL FORCES
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {/* Card 1: Life Path */}
              <div className="p-3 rounded-xl border-2 border-[#D4AF37] bg-[#160E33] text-center shadow-md">
                <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider block font-cinzel">
                  LIFE PATH NUMBER
                </span>
                <span className="font-cinzel text-3xl font-black text-[#FFE29F] block my-0.5">
                  {profile.lifePath.number}
                </span>
                <span className="font-sinhala text-[11px] font-bold text-slate-100 block leading-tight">
                  ජීවිත මාර්ග අංකය
                </span>
                <span className="text-[9px] text-slate-300 block mt-1 font-mono">
                  {profile.lifePath.reducedSteps}
                </span>
                <span className="font-sinhala text-[9px] text-[#FFE29F] block mt-1 line-clamp-1">
                  {profile.lifePath.archetypeSi}
                </span>
              </div>

              {/* Card 2: Destiny */}
              <div className="p-3 rounded-xl border border-slate-700 bg-[#0C1124] text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-cinzel">
                  DESTINY / EXPRESSION
                </span>
                <span className="font-cinzel text-3xl font-black text-slate-100 block my-0.5">
                  {profile.destiny.number}
                </span>
                <span className="font-sinhala text-[11px] font-bold text-slate-200 block leading-tight">
                  ඉරණම / ප්‍රකාශන අංකය
                </span>
                <span className="text-[9px] text-slate-400 block mt-1">සම්පූර්ණ නාම එකතුව</span>
                <span className="font-sinhala text-[9px] text-slate-300 block mt-1 line-clamp-1">
                  {profile.destiny.archetypeSi}
                </span>
              </div>

              {/* Card 3: Soul Urge */}
              <div className="p-3 rounded-xl border border-slate-700 bg-[#0C1124] text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-cinzel">
                  SOUL URGE
                </span>
                <span className="font-cinzel text-3xl font-black text-slate-100 block my-0.5">
                  {profile.soulUrge.number}
                </span>
                <span className="font-sinhala text-[11px] font-bold text-slate-200 block leading-tight">
                  ආත්මීය ආශා අංකය
                </span>
                <span className="text-[9px] text-slate-400 block mt-1">ස්වර අක්ෂර එකතුව</span>
                <span className="font-sinhala text-[9px] text-slate-300 block mt-1 line-clamp-1">
                  {profile.soulUrge.archetypeSi}
                </span>
              </div>

              {/* Card 4: Personality */}
              <div className="p-3 rounded-xl border border-slate-700 bg-[#0C1124] text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-cinzel">
                  PERSONALITY
                </span>
                <span className="font-cinzel text-3xl font-black text-slate-100 block my-0.5">
                  {profile.personality.number}
                </span>
                <span className="font-sinhala text-[11px] font-bold text-slate-200 block leading-tight">
                  බාහිර පෞරුෂ අංකය
                </span>
                <span className="text-[9px] text-slate-400 block mt-1">ව්‍යංජන එකතුව</span>
                <span className="font-sinhala text-[9px] text-slate-300 block mt-1 line-clamp-1">
                  {profile.personality.archetypeSi}
                </span>
              </div>

              {/* Card 5: Birthday */}
              <div className="p-3 rounded-xl border border-slate-700 bg-[#0C1124] text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-cinzel">
                  BIRTHDAY NUMBER
                </span>
                <span className="font-cinzel text-3xl font-black text-slate-100 block my-0.5">
                  {profile.birthday.number}
                </span>
                <span className="font-sinhala text-[11px] font-bold text-slate-200 block leading-tight">
                  උපන් දින අංකය
                </span>
                <span className="text-[9px] text-slate-400 block mt-1">{profile.birthday.reducedSteps}</span>
                <span className="font-sinhala text-[9px] text-slate-300 block mt-1">සහජ දක්ෂතා</span>
              </div>

              {/* Card 6: Maturity */}
              <div className="p-3 rounded-xl border border-slate-700 bg-[#0C1124] text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-cinzel">
                  MATURITY NUMBER
                </span>
                <span className="font-cinzel text-3xl font-black text-slate-100 block my-0.5">
                  {profile.maturity.number}
                </span>
                <span className="font-sinhala text-[11px] font-bold text-slate-200 block leading-tight">
                  පරිණතතා අංකය
                </span>
                <span className="text-[9px] text-slate-400 block mt-1">Life Path + Destiny</span>
                <span className="font-sinhala text-[9px] text-slate-300 block mt-1">අවුරුදු 35න් පසු</span>
              </div>

              {/* Card 7: Personal Year */}
              <div className="p-3 rounded-xl border border-[#D4AF37]/50 bg-[#19122C] text-center">
                <span className="text-[9px] font-bold text-[#FFE29F] uppercase tracking-wider block font-cinzel">
                  PERSONAL YEAR
                </span>
                <span className="font-cinzel text-3xl font-black text-[#FFE29F] block my-0.5">
                  {profile.personalYear.number}
                </span>
                <span className="font-sinhala text-[11px] font-bold text-slate-100 block leading-tight">
                  වත්මන් වර්ෂය ({new Date().getFullYear()})
                </span>
                <span className="text-[9px] text-slate-300 block mt-1">වාර්ෂික ශක්තිය</span>
                <span className="font-sinhala text-[9px] text-[#FFE29F] block mt-1">වර්ෂ චක්‍රය</span>
              </div>

              {/* Card 8: Common Name */}
              <div className="p-3 rounded-xl border border-slate-700 bg-[#0C1124] text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-cinzel">
                  COMMON NAME
                </span>
                <span className="font-cinzel text-3xl font-black text-slate-100 block my-0.5">
                  {profile.commonNameNumber.number}
                </span>
                <span className="font-sinhala text-[11px] font-bold text-slate-200 block leading-tight">
                  භාවිත නාම අංකය
                </span>
                <span className="text-[9px] text-slate-400 block mt-1">{customerInput.commonName}</span>
                <span className="font-sinhala text-[9px] text-slate-300 block mt-1">දෛනික කම්පනය</span>
              </div>
            </div>
          </div>

          {/* Letter Vibration Sub-Analysis */}
          <div className="grid grid-cols-3 gap-2.5 mb-4 font-sinhala">
            <div className="p-3 rounded-xl border border-slate-800 bg-[#0A0E1D]">
              <span className="text-[9px] text-[#D4AF37] font-bold block uppercase">CORNERSTONE (ප්‍රථම අකුර)</span>
              <div className="flex items-center space-x-2 my-1">
                <span className="font-cinzel text-xl font-black text-[#FFE29F]">{profile.cornerstone.letter}</span>
                <span className="text-[10px] text-slate-300">නව අවස්ථා හමුවේ ප්‍රවේශය</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">{profile.cornerstone.meaningSi}</p>
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-[#0A0E1D]">
              <span className="text-[9px] text-[#D4AF37] font-bold block uppercase">CAPSTONE (අවසාන අකුර)</span>
              <div className="flex items-center space-x-2 my-1">
                <span className="font-cinzel text-xl font-black text-[#FFE29F]">{profile.capstone.letter}</span>
                <span className="text-[10px] text-slate-300">කාර්යයන් අවසන් කරන විලාසය</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">{profile.capstone.meaningSi}</p>
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-[#0A0E1D]">
              <span className="text-[9px] text-[#D4AF37] font-bold block uppercase">FIRST VOWEL (පළමු ස්වරය)</span>
              <div className="flex items-center space-x-2 my-1">
                <span className="font-cinzel text-xl font-black text-[#FFE29F]">{profile.firstVowel.letter}</span>
                <span className="text-[10px] text-slate-300">අභ්‍යන්තර චිත්තවේගීය පෙළඹවීම</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">{profile.firstVowel.meaningSi}</p>
            </div>
          </div>

          {/* Name Comparison Summary */}
          <div className="p-3.5 rounded-xl border border-[#D4AF37]/30 bg-[#0F1428] font-sinhala text-[11px] leading-relaxed">
            <span className="font-bold text-[#FFE29F] block mb-1">
              නාම සංසන්දනය: උප්පැන්න නාමය ({customerInput.legalName} → #{profile.nameNumber.number}) vs භාවිත නාමය ({customerInput.commonName} → #{profile.commonNameNumber.number})
            </span>
            <p className="text-slate-300">
              {nameComparison.analysisSi}
            </p>
          </div>
        </div>

        <PageFooter pageNum={1} />
      </div>

      {/* ========================================================================= */}
      {/* PAGE 2 OF 4: CORE PERSONALITY, TIMELINES & WORK (SECTIONS 2 - 8)         */}
      {/* ========================================================================= */}
      <div className="a4-page p-8 flex flex-col justify-between bg-[#080B14] border border-[#D4AF37]/20 relative">
        <div>
          <PageHeader pageTitle="සමස්ත පෞරුෂය, වෘත්තිය සහ ජීවන අවධීන්" pageNum={2} />

          {/* Section 2: Overall Life Pattern */}
          <div className="mb-3.5 font-sinhala">
            <h3 className="text-xs font-bold text-[#FFE29F] flex items-center space-x-1.5 mb-1">
              <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>කොටස 2: සමස්ත ජීවිත රටාව හා පෞරුෂය (Overall Life Pattern & Archetype)</span>
            </h3>
            <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1122] text-[11px] text-slate-300 leading-relaxed space-y-1.5">
              <p>{sections[1]?.contentSi[0]}</p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded bg-emerald-950/20 border border-emerald-900/30 text-[10px]">
                  <span className="font-bold text-emerald-400 block mb-0.5">ප්‍රධාන ශක්තීන්:</span>
                  <span className="text-slate-300 leading-tight block">{summary.strongestQualities.join(' • ')}</span>
                </div>
                <div className="p-2 rounded bg-amber-950/20 border border-amber-900/30 text-[10px]">
                  <span className="font-bold text-amber-400 block mb-0.5">ප්‍රධාන අභියෝගය:</span>
                  <span className="text-slate-300 leading-tight block">{summary.biggestChallenges[0]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Layout for Sections 3, 4, 5 */}
          <div className="grid grid-cols-3 gap-2.5 mb-3.5 font-sinhala">
            {/* Section 3: Past */}
            <div className="p-3 rounded-xl border border-slate-800 bg-[#0A0E1D] text-[10.5px]">
              <span className="text-[10px] font-bold text-[#FFE29F] block mb-1">
                කොටස 3: අතීත අත්දැකීම් (Past Lessons)
              </span>
              <p className="text-slate-300 leading-relaxed line-clamp-5">
                {sections[2]?.contentSi[0]}
              </p>
            </div>

            {/* Section 4: Present */}
            <div className="p-3 rounded-xl border border-slate-800 bg-[#0A0E1D] text-[10.5px]">
              <span className="text-[10px] font-bold text-[#FFE29F] block mb-1">
                කොටස 4: වර්තමාන අවධිය (Present Phase)
              </span>
              <p className="text-slate-300 leading-relaxed line-clamp-5">
                {sections[3]?.contentSi[0]}
              </p>
            </div>

            {/* Section 5: Future */}
            <div className="p-3 rounded-xl border border-slate-800 bg-[#0A0E1D] text-[10.5px]">
              <span className="text-[10px] font-bold text-[#FFE29F] block mb-1">
                කොටස 5: අනාගත විභවයන් (Future Horizons)
              </span>
              <p className="text-slate-300 leading-relaxed line-clamp-5">
                {sections[4]?.contentSi[0]}
              </p>
            </div>
          </div>

          {/* Sections 6, 7, 8: Career, Business & Education */}
          <div className="space-y-2.5 font-sinhala">
            {/* Section 6: Career */}
            <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1122]">
              <h4 className="text-[11px] font-bold text-[#FFE29F] flex items-center space-x-1 mb-1">
                <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>කොටස 6: වෘත්තීය හා රැකියා මාවත (Career & Professional Strengths)</span>
              </h4>
              <p className="text-[10.5px] text-slate-300 leading-relaxed">
                {sections[5]?.contentSi[0]} {sections[5]?.contentSi[2]}
              </p>
            </div>

            {/* Section 7: Business */}
            <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1122]">
              <h4 className="text-[11px] font-bold text-[#FFE29F] flex items-center space-x-1 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>කොටස 7: ව්‍යාපාරික හා ව්‍යවසායකත්ව විභවය (Business & Entrepreneurship)</span>
              </h4>
              <p className="text-[10.5px] text-slate-300 leading-relaxed">
                {sections[6]?.contentSi[0]} {sections[6]?.contentSi[1]}
              </p>
            </div>

            {/* Section 8: Education */}
            <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1122]">
              <h4 className="text-[11px] font-bold text-[#FFE29F] flex items-center space-x-1 mb-1">
                <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>කොටස 8: අධ්‍යාපනය හා ඉගෙනුම් විලාසය (Education & Intellect)</span>
              </h4>
              <p className="text-[10.5px] text-slate-300 leading-relaxed">
                {sections[7]?.contentSi[0]}
              </p>
            </div>
          </div>
        </div>

        <PageFooter pageNum={2} />
      </div>

      {/* ========================================================================= */}
      {/* PAGE 3 OF 4: RELATIONSHIPS, FAMILY, FINANCES & AUSPICIOUS (SECTIONS 9-18) */}
      {/* ========================================================================= */}
      <div className="a4-page p-8 flex flex-col justify-between bg-[#080B14] border border-[#D4AF37]/20 relative">
        <div>
          <PageHeader pageTitle="සබඳතා, පවුල, මූල්‍ය හා සුබදායක සාධක" pageNum={3} />

          {/* Section 9, 10, 11: Love, Marriage & Partner Qualities */}
          <div className="mb-3.5 font-sinhala">
            <h3 className="text-xs font-bold text-[#FFE29F] flex items-center space-x-1.5 mb-1.5">
              <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>කොටස් 9, 10 & 11: ප්‍රේමය, විවාහය සහ අනාගත සහකරු (Love, Marriage & Partner)</span>
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl border border-slate-800 bg-[#0A0E1D] text-[10.5px]">
                <span className="font-bold text-slate-200 block mb-1">ආදරය හා ප්‍රේමය (Sec 9):</span>
                <p className="text-slate-300 leading-relaxed line-clamp-5">{sections[8]?.contentSi[0]}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-[#0A0E1D] text-[10.5px]">
                <span className="font-bold text-slate-200 block mb-1">විවාහ ජීවිතය (Sec 10):</span>
                <p className="text-slate-300 leading-relaxed line-clamp-5">{sections[9]?.contentSi[0]}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-[#0A0E1D] text-[10.5px]">
                <span className="font-bold text-[#FFE29F] block mb-1">අනාගත සහකරු (Sec 11):</span>
                <p className="text-slate-300 leading-relaxed line-clamp-5">{sections[10]?.contentSi[0]}</p>
              </div>
            </div>
          </div>

          {/* Section 12, 13, 14: Family, Parents & Parenthood */}
          <div className="mb-3.5 font-sinhala">
            <h3 className="text-xs font-bold text-[#FFE29F] flex items-center space-x-1.5 mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>කොටස් 12, 13 & 14: පවුල් ජීවිතය, දෙමාපියන් සහ දරුවන් (Family & Parenthood)</span>
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl border border-slate-800 bg-[#0A0E1D] text-[10.5px]">
                <span className="font-bold text-slate-200 block mb-1">ගෘහස්ථ පරිසරය (Sec 12):</span>
                <p className="text-slate-300 leading-relaxed line-clamp-4">{sections[11]?.contentSi[0]}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-[#0A0E1D] text-[10.5px]">
                <span className="font-bold text-slate-200 block mb-1">දෙමාපිය සබඳතා (Sec 13):</span>
                <p className="text-slate-300 leading-relaxed line-clamp-4">{sections[12]?.contentSi[0]}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-[#0A0E1D] text-[10.5px]">
                <span className="font-bold text-slate-200 block mb-1">දරුවන් හා මාපිය භූමිකාව (Sec 14):</span>
                <p className="text-slate-300 leading-relaxed line-clamp-4">{sections[13]?.contentSi[0]}</p>
              </div>
            </div>
          </div>

          {/* Section 15: Financial Life */}
          <div className="mb-3.5 font-sinhala">
            <h3 className="text-xs font-bold text-[#FFE29F] flex items-center space-x-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>කොටස 15: මූල්‍ය ජීවිතය සහ ධන ආකර්ෂණය (Financial Flow & Wealth Discipline)</span>
            </h3>
            <div className="p-3 rounded-xl border border-slate-800 bg-[#0C1122] text-[10.5px] text-slate-300 leading-relaxed">
              <p>{sections[14]?.contentSi[0]} {sections[14]?.contentSi[1]}</p>
            </div>
          </div>

          {/* Sections 16, 17, 18: Auspicious Powers (Lucky Numbers, Days, Colors) */}
          <div className="font-sinhala">
            <h3 className="text-xs font-bold text-[#FFE29F] flex items-center space-x-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>කොටස් 16, 17 & 18: සුබදායක අංක, දින සහ වර්ණ (Auspicious Powers)</span>
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Lucky Numbers */}
              <div className="p-3 rounded-xl border border-[#D4AF37]/30 bg-[#140E2A]">
                <span className="text-[10px] text-[#FFE29F] font-bold block mb-1">වාසනාවන්ත අංක (Numbers)</span>
                <div className="flex space-x-1.5 font-cinzel my-1">
                  {luckyFactors.numbers.map((n, i) => (
                    <span key={i} className="w-7 h-7 rounded-full border border-[#D4AF37] bg-[#D4AF37]/20 text-[#FFE29F] font-bold flex items-center justify-center text-xs">
                      {n}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-300 leading-tight mt-1 line-clamp-2">{luckyFactors.numbersExplanationSi}</p>
              </div>

              {/* Lucky Days */}
              <div className="p-3 rounded-xl border border-slate-800 bg-[#0A0E1D]">
                <span className="text-[10px] text-slate-200 font-bold block mb-1">සුබදායක දින (Favorable Days)</span>
                <span className="text-xs font-bold text-[#FFE29F] block my-1">{luckyFactors.days.join(' සහ ')}</span>
                <p className="text-[10px] text-slate-300 leading-tight line-clamp-2">{luckyFactors.daysExplanationSi}</p>
              </div>

              {/* Lucky Colors */}
              <div className="p-3 rounded-xl border border-slate-800 bg-[#0A0E1D]">
                <span className="text-[10px] text-slate-200 font-bold block mb-1">වාසනාවන්ත වර්ණ (Colors)</span>
                <span className="text-xs font-bold text-[#FFE29F] block my-1">{luckyFactors.colors.join(', ')}</span>
                <p className="text-[10px] text-slate-300 leading-tight line-clamp-2">{luckyFactors.colorsExplanationSi}</p>
              </div>
            </div>
          </div>
        </div>

        <PageFooter pageNum={3} />
      </div>

      {/* ========================================================================= */}
      {/* PAGE 4 OF 4: NAME DYNAMICS, 8-YEAR TIMELINE & FINAL SEAL (SECTIONS 19-22) */}
      {/* ========================================================================= */}
      <div className="a4-page p-8 flex flex-col justify-between bg-gradient-to-b from-[#080B14] via-[#0E0922] to-[#060913] border-4 border-[#D4AF37]/30 relative">
        <div>
          <PageHeader pageTitle="නාම විග්‍රහය, ඉදිරි වසර චක්‍ර සහ අවසාන සාරාංශය" pageNum={4} />

          {/* Section 19 & 20: Name Change & Balance Guidance */}
          <div className="p-3 rounded-xl border border-slate-800 bg-[#0A0E1D] font-sinhala text-[10.5px] leading-relaxed mb-3">
            <span className="font-bold text-[#FFE29F] block mb-0.5">
              කොටස් 19 & 20: නාම අක්ෂර සහ නාම වෙනස්කම් පිළිබඳ අංක විද්‍යාත්මක උපදෙස (Name Dynamics)
            </span>
            <p className="text-slate-300">
              {nameComparison.adviceSi}
            </p>
          </div>

          {/* Section 21: 8-Year Timeline Table */}
          <div className="mb-3.5 font-sinhala">
            <h3 className="text-xs font-bold text-[#FFE29F] flex items-center space-x-1.5 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>කොටස 21: ඉදිරි වසර 8 සඳහා වාර්ෂික අංක චක්‍ර (8-Year Life Cycle Timeline)</span>
            </h3>
            <div className="overflow-hidden rounded-xl border border-slate-800 text-[10px]">
              <table className="w-full text-left">
                <thead className="bg-[#140E2D] text-[#FFE29F] border-b border-slate-800">
                  <tr>
                    <th className="p-1.5 pl-2.5 font-bold font-cinzel">වසර</th>
                    <th className="p-1.5 font-bold font-cinzel">චක්‍ර අංකය</th>
                    <th className="p-1.5 font-bold">ප්‍රධාන වාර්ෂික තේමාව</th>
                    <th className="p-1.5 font-bold">ක්‍රියාකාරී අවධානය</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-[#080C1A]">
                  {timeline.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-transparent'}>
                      <td className="p-1.5 pl-2.5 font-bold font-cinzel text-slate-200">{item.year}</td>
                      <td className="p-1.5">
                        <span className="px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#FFE29F] font-bold font-cinzel">
                          #{item.personalYearNumber}
                        </span>
                      </td>
                      <td className="p-1.5 text-slate-200 font-medium">{item.themeSi}</td>
                      <td className="p-1.5 text-slate-400">{item.focusSi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 22: Final Life Summary & Wisdom */}
          <div className="p-3.5 rounded-xl border border-[#D4AF37]/40 bg-[#120E26] font-sinhala mb-3.5">
            <h4 className="text-[11px] font-bold text-[#FFE29F] flex items-center space-x-1 mb-1">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>කොටස 22: අවසාන ජීවිත සාරාංශය සහ ප්‍රධාන උපදෙස (Final Life Synthesis)</span>
            </h4>
            <p className="text-[10.5px] text-slate-200 italic leading-relaxed mb-2">
              "{summary.keyAdvice}"
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>ප්‍රධාන දිශානතිය: {summary.careerDirection.slice(0, 70)}...</span>
              <span className="text-[#FFE29F] font-medium">අංක රටාවේ පූර්ණ සුසංයෝගය</span>
            </div>
          </div>

          {/* NETHRA Official Certificate Seal of Authenticity */}
          <div className="p-4 rounded-xl border border-dashed border-[#D4AF37]/50 bg-[#0B0F20]/90 text-center font-sinhala">
            <div className="w-10 h-10 mx-auto rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#D4AF37]/10 mb-1.5">
              <Award className="w-5 h-5 text-[#FFE29F]" />
            </div>
            <h5 className="font-cinzel text-xs font-bold text-[#FFE29F] tracking-wider uppercase">
              NETHRA OFFICIAL NUMEROLOGY CERTIFICATE
            </h5>
            <p className="text-xs text-slate-200 mt-1 max-w-md mx-auto leading-relaxed">
              "{summary.closingBlessingSi}"
            </p>
            <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between px-4">
              <span>සේවාදායකයා: {customerInput.legalName}</span>
              <span>සහතික කළ දිනය: {formattedDate}</span>
              <span className="font-cinzel text-[#D4AF37] font-semibold">NETHRA SACRED NUMEROLOGY</span>
            </div>
          </div>
        </div>

        <PageFooter pageNum={4} />
      </div>

    </div>
  );
};
