export interface CustomerInput {
  legalName: string; // Full legal name in English Block Capitals (e.g. KAMAL PERERA)
  commonName: string; // Calling / everyday name (e.g. KAMAL)
  birthDate: string; // YYYY-MM-DD or DD/MM/YYYY
  birthTime?: string; // Optional (e.g. 10:45 AM or 14:30)
}

export interface NumerologyCalculation {
  number: number;
  isMaster: boolean;
  reducedSteps: string; // e.g. "1 + 5 + 0 + 8 + 2 + 0 + 0 + 4 = 20 = 2"
  meaningSi: string;
  archetypeSi: string;
}

export interface LetterVibration {
  letter: string;
  value: number;
  isVowel: boolean;
}

export interface NumerologyProfile {
  lifePath: NumerologyCalculation;
  destiny: NumerologyCalculation;
  soulUrge: NumerologyCalculation;
  personality: NumerologyCalculation;
  birthday: NumerologyCalculation;
  maturity: NumerologyCalculation;
  personalYear: NumerologyCalculation;
  personalMonth: NumerologyCalculation;
  nameNumber: NumerologyCalculation;
  commonNameNumber: NumerologyCalculation;
  cornerstone: { letter: string; meaningSi: string };
  capstone: { letter: string; meaningSi: string };
  firstVowel: { letter: string; meaningSi: string };
  legalLetterBreakdown: LetterVibration[];
  commonLetterBreakdown: LetterVibration[];
  letterCounts: Record<number, number>;
  karmicLessons: number[]; // Numbers missing from legal name
}

export interface ReadingSection {
  id: number;
  sectionNumber: number;
  titleSi: string;
  titleEn: string;
  subtitleSi?: string;
  summarySi: string;
  contentSi: string[]; // Structured paragraphs
  keyPointsSi?: string[];
  tableData?: Array<{ label: string; value: string; notes?: string }>;
}

export interface LifePeriodTimelineItem {
  year: number;
  personalYearNumber: number;
  themeSi: string;
  focusSi: string;
  adviceSi: string;
}

export interface CompleteReading {
  id: string;
  createdAt: string;
  customerInput: CustomerInput;
  profile: NumerologyProfile;
  sections: ReadingSection[];
  timeline: LifePeriodTimelineItem[];
  luckyFactors: {
    numbers: number[];
    numbersExplanationSi: string;
    days: string[];
    daysExplanationSi: string;
    colors: string[];
    colorsExplanationSi: string;
    gemsSi?: string;
    directionSi?: string;
  };
  nameComparison: {
    legalName: string;
    legalNumber: number;
    commonName: string;
    commonNumber: number;
    isHarmonious: boolean;
    analysisSi: string;
    adviceSi: string;
  };
  summary: {
    strongestQualities: string[];
    biggestChallenges: string[];
    careerDirection: string;
    relationshipTheme: string;
    marriageTheme: string;
    familyTheme: string;
    financialTheme: string;
    futureTheme: string;
    nameTheme: string;
    keyAdvice: string;
    closingBlessingSi: string;
  };
}
