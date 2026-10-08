import {
  CustomerInput,
  LetterVibration,
  NumerologyCalculation,
  NumerologyProfile,
  LifePeriodTimelineItem
} from '../types/reading';

// Pythagorean letter values
const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

// Check if a number is a Master Number
export function isMasterNumber(num: number): boolean {
  return num === 11 || num === 22 || num === 33;
}

// Reduce a number with Master Number preservation
export function reduceNumber(
  num: number,
  preserveMaster = true
): { result: number; isMaster: boolean; steps: number[] } {
  const steps: number[] = [num];
  let current = num;

  while (current > 9) {
    if (preserveMaster && isMasterNumber(current)) {
      return { result: current, isMaster: true, steps };
    }
    const digits = current
      .toString()
      .split('')
      .map(d => parseInt(d, 10))
      .filter(d => !isNaN(d));

    current = digits.reduce((sum, d) => sum + d, 0);
    steps.push(current);

    if (preserveMaster && isMasterNumber(current)) {
      return { result: current, isMaster: true, steps };
    }
  }

  return { result: current, isMaster: false, steps };
}

// Format step calculation string for display
export function formatSteps(initialExpression: string, steps: number[]): string {
  if (steps.length <= 1) {
    return `${initialExpression} = ${steps[0]}`;
  }
  return `${initialExpression} = ${steps.join(' = ')}`;
}

// Clean text to block capitals
export function sanitizeName(name: string): string {
  return name.trim().toUpperCase().replace(/[^A-Z\s]/g, '');
}

// Letter analysis for a name
export function analyzeLetters(name: string): LetterVibration[] {
  const clean = sanitizeName(name);
  const result: LetterVibration[] = [];

  for (const char of clean) {
    if (char >= 'A' && char <= 'Z') {
      result.push({
        letter: char,
        value: PYTHAGOREAN_MAP[char] || 0,
        isVowel: VOWELS.has(char)
      });
    }
  }
  return result;
}

// Calculate name totals (all, vowels, consonants)
export function calculateNameValues(name: string) {
  const letters = analyzeLetters(name);
  const totalLetters = letters.map(l => l.value);
  const vowelLetters = letters.filter(l => l.isVowel).map(l => l.value);
  const consonantLetters = letters.filter(l => !l.isVowel).map(l => l.value);

  const totalSum = totalLetters.reduce((a, b) => a + b, 0);
  const vowelSum = vowelLetters.reduce((a, b) => a + b, 0);
  const consonantSum = consonantLetters.reduce((a, b) => a + b, 0);

  const totalReduced = reduceNumber(totalSum);
  const vowelReduced = reduceNumber(vowelSum);
  const consonantReduced = reduceNumber(consonantSum);

  const letterCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (const l of letters) {
    if (letterCounts[l.value] !== undefined) {
      letterCounts[l.value]++;
    }
  }

  const karmicLessons: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (letterCounts[i] === 0) {
      karmicLessons.push(i);
    }
  }

  return {
    letters,
    total: {
      sum: totalSum,
      reduced: totalReduced.result,
      isMaster: totalReduced.isMaster,
      steps: totalReduced.steps,
      expression: letters.map(l => `${l.letter}(${l.value})`).join(' + ')
    },
    vowels: {
      sum: vowelSum,
      reduced: vowelReduced.result,
      isMaster: vowelReduced.isMaster,
      steps: vowelReduced.steps,
      expression: letters.filter(l => l.isVowel).map(l => `${l.letter}(${l.value})`).join(' + ')
    },
    consonants: {
      sum: consonantSum,
      reduced: consonantReduced.result,
      isMaster: consonantReduced.isMaster,
      steps: consonantReduced.steps,
      expression: letters.filter(l => !l.isVowel).map(l => `${l.letter}(${l.value})`).join(' + ')
    },
    letterCounts,
    karmicLessons
  };
}

// Parse birth date safely supporting YYYY-MM-DD or DD/MM/YYYY or DD-MM-YYYY
export function parseDate(dateStr: string): { day: number; month: number; year: number } {
  let day = 1;
  let month = 1;
  let year = 2000;

  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    } else {
      // DD-MM-YYYY
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    }
  } else if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts[2]?.length === 4) {
      // DD/MM/YYYY
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    } else if (parts[0]?.length === 4) {
      // YYYY/MM/DD
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    }
  }

  return {
    day: isNaN(day) || day < 1 || day > 31 ? 1 : day,
    month: isNaN(month) || month < 1 || month > 12 ? 1 : month,
    year: isNaN(year) || year < 1900 ? 2000 : year
  };
}

// Calculate Life Path Number with full audit trail
export function calculateLifePath(dateStr: string): NumerologyCalculation {
  const { day, month, year } = parseDate(dateStr);

  const dayStr = day.toString().padStart(2, '0');
  const monthStr = month.toString().padStart(2, '0');
  const yearStr = year.toString();

  // Method 1: direct digit summation as requested in prompt:
  // e.g. 15/08/2004: 1 + 5 + 0 + 8 + 2 + 0 + 0 + 4 = 20 = 2
  const allDigits = `${dayStr}${monthStr}${yearStr}`
    .split('')
    .map(d => parseInt(d, 10));
  const rawSum = allDigits.reduce((a, b) => a + b, 0);
  const reduction = reduceNumber(rawSum);

  const expression = allDigits.join(' + ');
  const reducedSteps = formatSteps(expression, reduction.steps);

  return {
    number: reduction.result,
    isMaster: reduction.isMaster,
    reducedSteps,
    meaningSi: getLifePathKeyword(reduction.result),
    archetypeSi: getArchetypeTitle(reduction.result)
  };
}

// Calculate Birthday Number
export function calculateBirthdayNumber(day: number): NumerologyCalculation {
  const reduction = reduceNumber(day);
  const dayStr = day.toString();
  const expression = dayStr.length > 1 ? dayStr.split('').join(' + ') : `${day}`;
  const reducedSteps = day > 9 ? formatSteps(expression, reduction.steps) : `${day}`;

  return {
    number: reduction.result,
    isMaster: reduction.isMaster,
    reducedSteps,
    meaningSi: `උපන් දින ශක්තිය (${day})`,
    archetypeSi: getArchetypeTitle(reduction.result)
  };
}

// Calculate Personal Year Number for a given year (defaults to current year)
export function calculatePersonalYear(
  day: number,
  month: number,
  targetYear: number = new Date().getFullYear()
): NumerologyCalculation {
  const dayRed = reduceNumber(day, false).result;
  const monthRed = reduceNumber(month, false).result;
  const yearRed = reduceNumber(targetYear, false).result;

  const sum = dayRed + monthRed + yearRed;
  const reduction = reduceNumber(sum);
  const expression = `${dayRed} + ${monthRed} + ${yearRed}`;

  return {
    number: reduction.result,
    isMaster: reduction.isMaster,
    reducedSteps: formatSteps(expression, reduction.steps),
    meaningSi: `${targetYear} පෞද්ගලික වර්ෂය`,
    archetypeSi: `වර්ෂ චක්‍රය ${reduction.result}`
  };
}

// Calculate Personal Month Number
export function calculatePersonalMonth(
  personalYear: number,
  month: number = new Date().getMonth() + 1
): NumerologyCalculation {
  const sum = personalYear + month;
  const reduction = reduceNumber(sum);
  const expression = `${personalYear} + ${month}`;

  return {
    number: reduction.result,
    isMaster: reduction.isMaster,
    reducedSteps: formatSteps(expression, reduction.steps),
    meaningSi: `වත්මන් මාසික ශක්තිය`,
    archetypeSi: `මාසික අංකය ${reduction.result}`
  };
}

// Calculate Maturity Number (Life Path + Destiny)
export function calculateMaturity(lifePath: number, destiny: number): NumerologyCalculation {
  const sum = lifePath + destiny;
  const reduction = reduceNumber(sum);
  const expression = `${lifePath} + ${destiny}`;

  return {
    number: reduction.result,
    isMaster: reduction.isMaster,
    reducedSteps: formatSteps(expression, reduction.steps),
    meaningSi: `ජීවිතයේ පරිණත අවධියේ (අවුරුදු 35-40න් පසු) ප්‍රධාන ශක්තිය`,
    archetypeSi: getArchetypeTitle(reduction.result)
  };
}

// Key letter extraction (Cornerstone, Capstone, First Vowel)
export function extractKeyLetters(name: string) {
  const clean = sanitizeName(name);
  const firstWord = clean.split(' ')[0] || 'K';
  const letters = firstWord.split('').filter(c => c >= 'A' && c <= 'Z');

  const cornerstoneChar = letters[0] || 'A';
  const capstoneChar = letters[letters.length - 1] || 'A';
  const firstVowelChar = letters.find(c => VOWELS.has(c)) || 'A';

  return {
    cornerstone: {
      letter: cornerstoneChar,
      meaningSi: getCornerstoneMeaning(cornerstoneChar)
    },
    capstone: {
      letter: capstoneChar,
      meaningSi: getCapstoneMeaning(capstoneChar)
    },
    firstVowel: {
      letter: firstVowelChar,
      meaningSi: getFirstVowelMeaning(firstVowelChar)
    }
  };
}

// Complete profile calculation engine
export function generateNumerologyProfile(input: CustomerInput): NumerologyProfile {
  const { day, month } = parseDate(input.birthDate);
  const lifePath = calculateLifePath(input.birthDate);
  const birthday = calculateBirthdayNumber(day);

  const legalNameCalc = calculateNameValues(input.legalName);
  const commonNameCalc = calculateNameValues(input.commonName);

  const destiny: NumerologyCalculation = {
    number: legalNameCalc.total.reduced,
    isMaster: legalNameCalc.total.isMaster,
    reducedSteps: formatSteps(legalNameCalc.total.expression, legalNameCalc.total.steps),
    meaningSi: 'ඉරණම සහ ස්වභාවික හැකියාවන් ප්‍රකාශනය',
    archetypeSi: getArchetypeTitle(legalNameCalc.total.reduced)
  };

  const soulUrge: NumerologyCalculation = {
    number: legalNameCalc.vowels.reduced,
    isMaster: legalNameCalc.vowels.isMaster,
    reducedSteps: formatSteps(legalNameCalc.vowels.expression || '0', legalNameCalc.vowels.steps),
    meaningSi: 'හදවතේ ගැඹුරුම අභ්‍යන්තර ආශාව හා සැබෑ තෘප්තිය',
    archetypeSi: getArchetypeTitle(legalNameCalc.vowels.reduced)
  };

  const personality: NumerologyCalculation = {
    number: legalNameCalc.consonants.reduced,
    isMaster: legalNameCalc.consonants.isMaster,
    reducedSteps: formatSteps(legalNameCalc.consonants.expression || '0', legalNameCalc.consonants.steps),
    meaningSi: 'සමාජය ඔබව දකින ආකාරය සහ බාහිර පෞරුෂ ප්‍රකාශනය',
    archetypeSi: getArchetypeTitle(legalNameCalc.consonants.reduced)
  };

  const maturity = calculateMaturity(lifePath.number, destiny.number);
  const currentYear = new Date().getFullYear();
  const personalYear = calculatePersonalYear(day, month, currentYear);
  const personalMonth = calculatePersonalMonth(personalYear.number);

  const nameNumber: NumerologyCalculation = {
    number: legalNameCalc.total.reduced,
    isMaster: legalNameCalc.total.isMaster,
    reducedSteps: `${legalNameCalc.total.sum} -> ${legalNameCalc.total.reduced}`,
    meaningSi: 'උප්පැන්න සහතිකයේ නාම කම්පනය',
    archetypeSi: getArchetypeTitle(legalNameCalc.total.reduced)
  };

  const commonNameNumber: NumerologyCalculation = {
    number: commonNameCalc.total.reduced,
    isMaster: commonNameCalc.total.isMaster,
    reducedSteps: `${commonNameCalc.total.sum} -> ${commonNameCalc.total.reduced}`,
    meaningSi: 'දෛනිකව භාවිත කරන නාම කම්පනය',
    archetypeSi: getArchetypeTitle(commonNameCalc.total.reduced)
  };

  const keyLetters = extractKeyLetters(input.legalName);

  return {
    lifePath,
    destiny,
    soulUrge,
    personality,
    birthday,
    maturity,
    personalYear,
    personalMonth,
    nameNumber,
    commonNameNumber,
    cornerstone: keyLetters.cornerstone,
    capstone: keyLetters.capstone,
    firstVowel: keyLetters.firstVowel,
    legalLetterBreakdown: legalNameCalc.letters,
    commonLetterBreakdown: commonNameCalc.letters,
    letterCounts: legalNameCalc.letterCounts,
    karmicLessons: legalNameCalc.karmicLessons
  };
}

// Generate future timeline items (8 years starting from current year)
export function generateTimelineCycles(birthDate: string): LifePeriodTimelineItem[] {
  const { day, month } = parseDate(birthDate);
  const currentYear = new Date().getFullYear();
  const timeline: LifePeriodTimelineItem[] = [];

  const yearThemes: Record<number, { theme: string; focus: string; advice: string }> = {
    1: {
      theme: 'නව ආරම්භයන් සහ ස්වාධීනත්වයේ වසර (New Beginnings & Leadership)',
      focus: 'නව ව්‍යාපෘති ඇරඹීම, ස්වාධීන තීරණ, නිර්භීත පියවර ගැනීම',
      advice: 'පසුබට නොවී අලුත් මංපෙත් සොයා යන්න. අතීත බර අත්හැර ඉදිරියට යන්න.'
    },
    2: {
      theme: 'සහයෝගීතාවය සහ ඉවසීමේ වසර (Patience, Harmony & Partnerships)',
      focus: 'සබඳතා ශක්තිමත් කිරීම, සහයෝගය ලබාගැනීම, රාජ්‍යතාන්ත්‍රික මනස',
      advice: 'ක්ෂණික ප්‍රතිඵල බලාපොරොත්තු නොවී ඉවසීමෙන් කටයුතු කරන්න.'
    },
    3: {
      theme: 'නිර්මාණශීලී ප්‍රකාශනය සහ ප්‍රීතියේ වසර (Creativity & Social Joy)',
      focus: 'සන්නිවේදනය, කලාව, සමාජ සබඳතා වර්ධනය, අදහස් ප්‍රකාශය',
      advice: 'ඔබේ දක්ෂතා එළිදක්වන්න, විසිරුණු ශක්තීන් එක් අරමුණකට යොමු කරන්න.'
    },
    4: {
      theme: 'ශක්තිමත් පදනම් සහ වෙහෙස මහන්සියේ වසර (Discipline & Foundations)',
      focus: 'මූල්‍ය විනය, ස්ථාවරත්වය ගොඩනැගීම, ක්‍රමානුකූල සැලසුම් ක්‍රියාත්මක කිරීම',
      advice: 'කෙටි මං සොයන්නේ නැතිව මූලික පදනම ශක්තිමත් කරන්න.'
    },
    5: {
      theme: 'වෙනස්කම් සහ නිදහසේ වසර (Dynamic Shifts & Exploration)',
      focus: 'නව අවස්ථා, සංචාර, අනපේක්ෂිත සුබවාදී පෙරළි, නම්‍යශීලී බව',
      advice: 'වෙනස්කම්වලට බිය නොවී නව අත්දැකීම් විවෘත මනසකින් වැළඳගන්න.'
    },
    6: {
      theme: 'පවුල, වගකීම් සහ ප්‍රේමයේ වසර (Family, Care & Commitment)',
      focus: 'ගෘහස්ථ පරිසරය, පවුල් වගකීම්, විවාහ/ප්‍රේම සබඳතා සුවපත් කිරීම',
      advice: 'අන්‍යයන් වෙනුවෙන් කැපවීමේදී ඔබේ මානසික සුවයද ආරක්ෂා කරගන්න.'
    },
    7: {
      theme: 'අභ්‍යන්තර පරීක්ෂාව සහ අධ්‍යාත්මික වර්ධනයේ වසර (Inner Wisdom & Rest)',
      focus: 'ස්වයං අවබෝධය, පර්යේෂණ, අධ්‍යාත්මික සාමය, සැලසුම් සකස් කිරීම',
      advice: 'බාහිර ඝෝෂාවෙන් මිදී ගැඹුරු අධ්‍යයනයට සහ මානසික නිස්කලංකත්වයට ඉඩදෙන්න.'
    },
    8: {
      theme: 'බලය, මූල්‍ය අස්වැන්න සහ ජයග්‍රහණයේ වසර (Abundance & Power)',
      focus: 'ව්‍යාපාරික දියුණුව, මූල්‍ය ප්‍රතිලාභ, නායකත්ව පිළිගැනීම, ඉලක්ක සපුරා ගැනීම',
      advice: 'ආචාරධර්මීයව කටයුතු කරමින් ඔබේ බලය සහ විභවය උපරිමයෙන් භාවිත කරන්න.'
    },
    9: {
      theme: 'පරිසමාප්තිය සහ නව යුගයකට සූදානම් වීමේ වසර (Completion & Rebirth)',
      focus: 'අවසන් කිරීම්, සමාව දීම, අවශ්‍ය නොවන බැඳීම් අත්හැරීම, පරිත්‍යාගය',
      advice: 'නව 9-වසර චක්‍රයකට පිවිසීමට පෙර අතීත සියලු බර සැහැල්ලු කරගන්න.'
    },
    11: {
      theme: 'අන්තර්ඥානය සහ ආලෝකයේ ප්‍රධාන වසර (Master Illumination)',
      focus: 'අධ්‍යාත්මික පිබිදීම, උසස් ආශ්වාදය, අන්‍යයන්ට ආදර්ශවත් වීම',
      advice: 'ඔබේ සහජ බුද්ධියට සවන් දෙන්න, මානසික ආතතියෙන් මිදී මඟපෙන්වන්නෙකු වන්න.'
    },
    22: {
      theme: 'මහා නිර්මාණ සහ සාක්ෂාත්කරණයේ වසර (Master Builder)',
      focus: 'විශාල පරිමාණයේ ව්‍යාපෘති, සමාජයට බලපාන ස්ථිරසාර නිර්මාණ',
      advice: 'ඔබේ විශාල සිහින ප්‍රායෝගික ක්‍රියාමාර්ග බවට පත් කිරීමට පියවර ගන්න.'
    }
  };

  for (let i = 0; i < 8; i++) {
    const yr = currentYear + i;
    const py = calculatePersonalYear(day, month, yr);
    const info = yearThemes[py.number] || yearThemes[py.number % 9 || 9];

    timeline.push({
      year: yr,
      personalYearNumber: py.number,
      themeSi: info.theme,
      focusSi: info.focus,
      adviceSi: info.advice
    });
  }

  return timeline;
}

// Archetype titles for numbers
function getArchetypeTitle(num: number): string {
  switch (num) {
    case 1: return 'නායකයා සහ ආරම්භකයා (The Pioneer & Leader)';
    case 2: return 'සහයෝගීතා මිත්‍රයා සහ රාජ්‍යතාන්ත්‍රිකයා (The Diplomat & Peacemaker)';
    case 3: return 'නිර්මාණශීලී ප්‍රකාශකයා සහ ප්‍රබෝධකයා (The Creative Communicator)';
    case 4: return 'පදනම් ගොඩනගන්නා සහ ක්‍රමවේදියා (The Master Architect & Builder)';
    case 5: return 'නිදහස් ගවේෂකයා සහ විප්ලවීය නායකයා (The Freedom Seeker & Catalyst)';
    case 6: return 'පෝෂකයා සහ ආරක්ෂකයා (The Harmonizer & Caregiver)';
    case 7: return 'සත්‍ය ගවේෂකයා සහ ප්‍රඥාවන්තයා (The Mystic & Deep Thinker)';
    case 8: return 'සාර්ථකත්වයේ නියාමකයා සහ මූල්‍ය බලවතා (The Sovereign & Strategist)';
    case 9: return 'මානව හිතවාදියා සහ සර්වකාලීන ප්‍රඥාවන්තයා (The Humanitarian)';
    case 11: return 'දූරදර්ශී ආලෝකධාරකයා (Master Intuitive & Illuminator)';
    case 22: return 'යුග නිර්මාණකරුවා (Master Builder of Empires)';
    case 33: return 'විශ්වීය මඟපෙන්වන්නා (Master Teacher & Compassion)';
    default: return 'ගවේෂකයා';
  }
}

function getLifePathKeyword(num: number): string {
  switch (num) {
    case 1: return 'ස්වයං නායකත්වය, නව මංපෙත් හෙළිපෙහෙළි කිරීම, ස්වාධීනත්වය';
    case 2: return 'සංවේදීතාවය, සාමකාමී බව, සහයෝගීතාවය, රාජ්‍යතාන්ත්‍රික බව';
    case 3: return 'ස්වයං ප්‍රකාශනය, ආකර්ෂණීය සන්නිවේදනය, බුද්ධිමය ප්‍රමෝදය';
    case 4: return 'විනය, ස්ථාවර පදනම, ක්‍රමවත් බව, වෙහෙස නොබලන කැපවීම';
    case 5: return 'ගතික නිදහස, නම්‍යශීලී බව, නව අත්දැකීම්, සන්නිවේදන ශක්තිය';
    case 6: return 'පවුල් සෙනෙහස, යුතුකම් ඉටුකිරීම, සාමය හා යුක්තිය, නිර්මාණශීලීත්වය';
    case 7: return 'දර්ශනය, පර්යේෂණාත්මක මනස, අධ්‍යාත්මික පාරිශුද්ධත්වය, අභ්‍යන්තර ප්‍රඥාව';
    case 8: return 'පරිපාලන බලය, මූල්‍ය ආධිපත්‍යය, සංවිධානාත්මක ශක්තිය, ජයග්‍රහණය';
    case 9: return 'උසස් මානව හිතවාදය, දයාව, විශ්වීය දැක්ම, අවබෝධය';
    case 11: return 'උසස් අන්තර්ඥානය, අධ්‍යාත්මික ආලෝකය, ආදර්ශවත් නායකත්වය';
    case 22: return 'විශිෂ්ට ප්‍රායෝගික දැක්ම, සමාජ පරිවර්තනය, මහා ව්‍යාපෘති සාර්ථකත්වය';
    case 33: return 'විශ්වීය කරුණාව, ආධ්‍යාත්මික සුවපත් කිරීම, උත්තරීතර සේවය';
    default: return 'ජීවිතයේ මූලික ශක්තිය';
  }
}

function getCornerstoneMeaning(char: string): string {
  const map: Record<string, string> = {
    A: 'ස්වාධීන, අධිෂ්ඨානශීලී ප්‍රවේශයකි. නව අභියෝග හමුවේ නොසැලී මුලින්ම ඉදිරියට පියවර තබයි.',
    B: 'සංවේදී හා සාමකාමී ප්‍රවේශයකි. සහයෝගීතාවය සහ අනෙකාට ගරු කිරීමෙන් කාර්යයන් අරඹයි.',
    C: 'දීප්තිමත්, සන්නිවේදනශීලී සහ සුබවාදී ආරම්භයකි. සමාජීය සම්බන්ධතා ප්‍රමුඛ කරයි.',
    D: 'ප්‍රායෝගික, ක්‍රමානුකූල සහ විනයගරුක ආරම්භයකි. පදනම සවිමත්ව තහවුරු කරයි.',
    E: 'විවෘත, නම්‍යශීලී සහ ඉක්මන් වෙනස්කම්වලට සූදානම් ප්‍රවේශයකි.',
    F: 'වගකීම්සහගත සහ පවුල/සමීපතමයන්ගේ යහපත පෙරදැරි කරගත් ප්‍රවේශයකි.',
    G: 'විශ්ලේෂණාත්මක, සන්සුන් සහ ගැඹුරින් සිතා බලා තීන්දු ගන්නා ආරම්භයකි.',
    H: 'අධිෂ්ඨානවත්, ප්‍රතිඵල-අභිමුඛ සහ නායකත්ව ගුණයෙන් සපිරි ආරම්භයකි.',
    I: 'කරුණාවන්ත, සංවේදී සහ උසස් ප්‍රතිපත්ති මත පිහිටා ක්‍රියාත්මක වන ප්‍රවේශයකි.',
    J: 'ස්වයං විශ්වාසයෙන් යුතු, අනෙකාගේ මතවලට යටත් නොවී තනිව ඉදිරියට යන ස්වභාවයකි.',
    K: 'දැඩි අන්තර්ඥානයක් සහ නොසැලෙන සහජ ආවේගයක් පෙරදැරි කරගත් ආරම්භයකි.',
    L: 'බුද්ධිමත්, සමාජශීලී සහ විවිධ කෝණවලින් සිතා බලා පියවර තබන ප්‍රවේශයකි.',
    M: 'වෙහෙස මහන්සි වී වැඩකිරීමට නොපසුබට, ස්ථිරසාර සහ ඉවසීමෙන් පිරි ආරම්භයකි.',
    N: 'අද්විතීය, සාම්ප්‍රදායික නොවන සහ නිර්මාණශීලී අදහස්වලින් පිරි ආරම්භයකි.',
    O: 'සදාචාරාත්මක, පවුල් හිතකාමී සහ වගකීමෙන් යුතුව තීන්දු ගන්නා ආරම්භයකි.',
    P: 'තීක්ෂණ, ගුප්ත සහ ගැඹුරු දැනුමක් පසුබිම් කරගත් සන්සුන් ප්‍රවේශයකි.',
    R: 'ශක්තිමත්, කාර්යක්ෂම සහ අධික උද්‍යෝගයකින් යුතුව කාර්යයන් අරඹන ස්වභාවයකි.',
    S: 'චමත්කාරජනක, හැඟීම්බර සහ බලගතු ආකර්ෂණීය ශක්තියකින් යුතු ප්‍රවේශයකි.',
    T: 'වේගවත්, අන්‍යයන් වෙනුවෙන් පෙනී සිටින සහ සහයෝගී ආරම්භයකි.',
    U: 'වාසනාවන්ත, නිර්මාණශීලී සහ පරිත්‍යාගශීලී බව පෙරදැරි කරගත් ආරම්භයකි.',
    V: 'දැක්මක් සහිත, ප්‍රායෝගිකව විශාල දේ ගොඩනැගීමේ උනන්දුවක් සහිත ආරම්භයකි.',
    W: 'ක්‍රියාශීලී, නොනැවතී ගමන් කරන සහ බහුවිධ පැති ආවරණය කරන ප්‍රවේශයකි.',
    Y: 'ස්වාධීන, නිදහස් මතධාරී සහ ගැඹුරු විනිශ්චයකින් පියවර තබන ආරම්භයකි.'
  };
  return map[char] || 'ස්වාධීන සහ අද්විතීය ප්‍රවේශයකි.';
}

function getCapstoneMeaning(char: string): string {
  const map: Record<string, string> = {
    A: 'අරමුණක් අවසන් කිරීමේදී නොසැලෙන අධිෂ්ඨානයක් සහ ස්වාධීන ජයග්‍රහණයක් අත්කර ගනී.',
    D: 'ප්‍රායෝගිකව අවසන් අංශුව දක්වා නිවැරදිව හා ස්ථාවරව නිමාවට පත් කරයි.',
    E: 'කාර්යයක් අවසානයේ නව දිශානතියක් හෝ ඊළඟ පියවරක් වෙත නම්‍යශීලීව මාරු වේ.',
    H: 'ඉහළ සාර්ථකත්වයක් සහ මූල්‍යමය හෝ පිළිගැනීමේ ප්‍රතිඵලයක් සහිතව නිම කරයි.',
    L: 'මනාව සිතා බලා, සබඳතාවලට හානියක් නොවන සේ සුහදව අවසන් කරයි.',
    M: 'අසීමිත කැපවීමකින් හා වෙහෙසකින් තොරව කිසිදු කාර්යයක් අඩාල නොකර සම්පූර්ණ කරයි.',
    N: 'අනපේක්ෂිත, වෙනස්ම ආකාරයක සාර්ථක නිමාවක් ගෙන දෙයි.',
    R: 'දැඩි උද්යෝගයකින් හා පූර්ණ සතුටකින් ප්‍රතිඵලය සාක්ෂාත් කරගනී.',
    S: 'නාට්‍යමය හා ආකර්ෂණීය අවසානයක් සමඟ අන්‍යයන්ගේ පැසසුමට ලක්ව නිම කරයි.',
    T: 'අන්‍යයන් සමඟ බෙදාහදා ගනිමින් සහයෝගයෙන් අවසන් තීරණවලට එළඹෙයි.'
  };
  return map[char] || 'නොපසුබට උත්සාහයෙන් පූර්ණ ලෙස කාර්යයන් සාර්ථකව අවසන් කරයි.';
}

function getFirstVowelMeaning(char: string): string {
  const map: Record<string, string> = {
    A: 'ස්වාධීනත්වය, නායකත්වය සහ තම ආත්ම ගරුත්වය සුරැකීමේ නොනිමි ආශාව.',
    E: 'නිදහස, වෙනස, විවිධත්වය සහ නව අදහස් අත්හදා බැලීමේ පිපාසය.',
    I: 'උසස් පරමාදර්ශ, සෙනෙහස, කලාව සහ මනුෂ්‍යත්වයට සේවය කිරීමේ අභ්‍යන්තර පෙළඹවීම.',
    O: 'පවුල, සදාචාරය, ආරක්ෂාව සහ සාමකාමී ගෘහස්ථ සුවය පිළිබඳ දැඩි ඇල්ම.',
    U: 'ප්‍රීතිය, නිර්මාණශීලීත්වය, සහෝදරත්වය සහ තමන්ගේ සතුට අන්‍යයන් සමඟ බෙදාගැනීමේ ආශාව.'
  };
  return map[char] || 'අභ්‍යන්තර සාමය සහ අධ්‍යාත්මික තෘප්තිය.';
}
