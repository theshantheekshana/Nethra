import {
  CompleteReading,
  CustomerInput,
  NumerologyProfile,
  ReadingSection
} from '../types/reading';
import {
  generateNumerologyProfile,
  generateTimelineCycles
} from './calculator';
import { NUMBER_ARCHETYPES } from './archetypes';

// Helper to safely get archetype data for a number (falls back to reduced single digit if needed)
export function getArchetype(num: number) {
  if (NUMBER_ARCHETYPES[num]) {
    return NUMBER_ARCHETYPES[num];
  }
  const reduced = num > 9 ? (num % 9 === 0 ? 9 : num % 9) : num;
  return NUMBER_ARCHETYPES[reduced] || NUMBER_ARCHETYPES[1];
}

// Generate the complete 22-section life reading
export function generateCompleteReading(input: CustomerInput): CompleteReading {
  const profile: NumerologyProfile = generateNumerologyProfile(input);
  const timeline = generateTimelineCycles(input.birthDate);

  const lpArch = getArchetype(profile.lifePath.number);
  const destArch = getArchetype(profile.destiny.number);
  const soulArch = getArchetype(profile.soulUrge.number);
  const persArch = getArchetype(profile.personality.number);
  const bdayArch = getArchetype(profile.birthday.number);
  const matArch = getArchetype(profile.maturity.number);
  const pyArch = getArchetype(profile.personalYear.number);
  const commonArch = getArchetype(profile.commonNameNumber.number);

  // Name comparison calculation
  const isHarmonious =
    profile.nameNumber.number === profile.commonNameNumber.number ||
    Math.abs(profile.nameNumber.number - profile.commonNameNumber.number) % 2 === 0;

  const nameAnalysisSi =
    profile.nameNumber.number === profile.commonNameNumber.number
      ? `ඔබගේ උප්පැන්න සහතිකයේ නාම අංකය (${profile.nameNumber.number}) සහ දෛනිකව භාවිත කරන නාම අංකය (${profile.commonNameNumber.number}) එකම සංඛ්‍යාත්මක කම්පනය දරයි. මෙය ඔබගේ අභ්‍යන්තර හැකියාවන් සහ සමාජීය පිළිගැනීම අතර ස්වභාවික එකඟතාවක් සහ නිරවුල් ප්‍රකාශනයක් පෙන්නුම් කරන සුබදායක ලක්ෂණයකි.`
      : `ඔබගේ උප්පැන්න සහතිකයේ නාම අංකය ${profile.nameNumber.number} (${profile.nameNumber.archetypeSi}) වන අතර, දෛනිකව භාවිත කරන නාමය ${profile.commonNameNumber.number} (${profile.commonNameNumber.archetypeSi}) වේ. නීත්‍යානුකූල නාමයෙන් ඔබගේ මූලික ඉරණම් විභවය සලකුණු වන අතර, භාවිත නාමය සමාජය හමුවේ ඔබව සක්‍රීයව අර්ථ දක්වයි. මෙම අංක දෙක අතර පවතින වෙනස මගින් ඔබේ පෞරුෂයට බහුවිධ පැති සහ විවිධත්වයක් එක්කරනු ලබයි.`;

  const nameAdviceSi =
    'අංක විද්‍යාත්මක දෘෂ්ටිකෝණයෙන් නම වෙනස් කිරීම හෝ අක්ෂර ගැලපීම පිළිබඳව සලකා බැලිය හැකි පැති: නමක් වෙනස් කළ පමණින් ක්ෂණික සාර්ථකත්වයක් අත් නොවන නමුත්, ජීවිත මාර්ග අංකය (' +
    profile.lifePath.number +
    ') සමඟ සුසංයෝගී වන අයුරින් දෛනික භාවිත නාමය භාවිත කිරීමෙන් ඔබගේ සන්නිවේදන ශක්තිය සහ සමාජ ආකර්ෂණය වඩාත් සමබර කරගත හැක.';

  // Birth time note
  const birthTimeText = input.birthTime?.trim()
    ? `ලබාදී ඇති උපන් වේලාව (${input.birthTime}) අනුව, දවසේ කාල හෝරා චක්‍රය මගින් ඔබගේ ජීවිතයේ ක්‍රියාශීලී පැය සහ මානසික ඒකාග්‍රතාවය වැඩිදියුණු වන හෝරාවන් පිළිබඳ අතිරේක ශක්ති සම්ප්‍රේෂණය තහවුරු වේ.`
    : `උපන් වේලාවක් විශේෂයෙන් සටහන් කර නොමැති අතර, සම්මත අංක විද්‍යාත්මක විශ්ලේෂණය සඳහා උපන් දිනය සහ නාම කම්පනය පූර්ණ ලෙස ප්‍රමාණවත් වේ.`;

  // Build the 22 comprehensive sections
  const sections: ReadingSection[] = [
    // Section 1
    {
      id: 1,
      sectionNumber: 1,
      titleSi: 'පුද්ගලික අංක විද්‍යාත්මක පැතිකඩ',
      titleEn: 'Personal Numerology Profile',
      subtitleSi: 'මූලික සංඛ්‍යාත්මක කම්පන සහ ගණනය කිරීම් විග්‍රහය',
      summarySi: `ඔබගේ ජීවිතයේ ප්‍රධාන කේන්ද්‍රීය අංකය වන්නේ ජීවිත මාර්ග අංක ${profile.lifePath.number} (${profile.lifePath.archetypeSi}) වේ.`,
      contentSi: [
        `උප්පැන්න සහතිකයේ සඳහන් සම්පූර්ණ නම: ${input.legalName}`,
        `දැනට බහුලව භාවිත කරන නම: ${input.commonName}`,
        `උපන් දිනය: ${input.birthDate} | උපන් වේලාව: ${input.birthTime || 'සඳහන් කර නැත'}`,
        `1. ජීවිත මාර්ග අංකය (Life Path Number) = ${profile.lifePath.number} [ගණනය: ${profile.lifePath.reducedSteps}]: මෙය ඔබ මේ භවයේදී ගමන් කිරීමට නියමිත ප්‍රධාන මාවත, ජීවන අරමුණ සහ සහජ පෞරුෂ ශක්තිය ප්‍රකාශ කරයි.`,
        `2. ඉරණම / ප්‍රකාශන අංකය (Destiny / Expression Number) = ${profile.destiny.number} [ගණනය: ${profile.destiny.reducedSteps}]: උප්පැන්න නාමයේ සියලු අක්ෂරවල එකතුවෙන් ලැබෙන මෙම අංකය ඔබ සතු සහජ කුසලතා සහ ලෝකයට දායාද කළ හැකි ශක්තීන් නියෝජනය කරයි.`,
        `3. ආත්මීය ආශා අංකය (Soul Urge / Heart\'s Desire) = ${profile.soulUrge.number} [ගණනය: ${profile.soulUrge.reducedSteps}]: නාමයේ ස්වර අක්ෂර මගින් නියෝජනය වන මෙම අංකය ඔබගේ හදවතේ ගැඹුරුම අභ්‍යන්තර ආශාව සහ සැබෑ සතුට ප්‍රකාශ කරයි.`,
        `4. බාහිර පෞරුෂ අංකය (Personality Number) = ${profile.personality.number} [ගණනය: ${profile.personality.reducedSteps}]: නාමයේ ව්‍යංජන අක්ෂර මගින් සමාජය ඔබව මූලිකව දකින ආකාරය සහ ඔබේ බාහිර ආකර්ෂණය පෙන්නුම් කෙරේ.`,
        `5. උපන් දින අංකය (Birthday Number) = ${profile.birthday.number}: ඔබ උපන් දිනයේ සහජ ශක්තිය සහ ඔබේ ක්‍රියාකාරී දක්ෂතා පෙන්නුම් කරයි.`,
        `6. පරිණතතා අංකය (Maturity Number) = ${profile.maturity.number} [ගණනය: ${profile.maturity.reducedSteps}]: ජීවිතයේ වයස අවුරුදු 35-40 පසුකාලීනව වඩාත් ප්‍රබලව ක්‍රියාත්මක වන ප්‍රධාන ශක්තියයි.`,
        `7. පෞද්ගලික වර්ෂ අංකය (Personal Year Number) = ${profile.personalYear.number}: ඔබ වත්මන් වසරේ මුහුණ දෙන ප්‍රධාන වාර්ෂික තේමාව සහ ශක්ති චක්‍රයයි.`
      ],
      tableData: [
        { label: 'ජීවිත මාර්ග අංකය (Life Path)', value: `${profile.lifePath.number}`, notes: profile.lifePath.archetypeSi },
        { label: 'ඉරණම / ප්‍රකාශන අංකය (Destiny)', value: `${profile.destiny.number}`, notes: profile.destiny.archetypeSi },
        { label: 'ආත්මීය ආශා අංකය (Soul Urge)', value: `${profile.soulUrge.number}`, notes: profile.soulUrge.archetypeSi },
        { label: 'බාහිර පෞරුෂ අංකය (Personality)', value: `${profile.personality.number}`, notes: profile.personality.archetypeSi },
        { label: 'උපන් දින අංකය (Birthday)', value: `${profile.birthday.number}`, notes: profile.birthday.meaningSi },
        { label: 'පරිණතතා අංකය (Maturity)', value: `${profile.maturity.number}`, notes: profile.maturity.archetypeSi },
        { label: 'පෞද්ගලික වර්ෂය (Personal Year)', value: `${profile.personalYear.number}`, notes: profile.personalYear.meaningSi },
        { label: 'භාවිත නාම අංකය (Common Name)', value: `${profile.commonNameNumber.number}`, notes: profile.commonNameNumber.archetypeSi }
      ]
    },

    // Section 2
    {
      id: 2,
      sectionNumber: 2,
      titleSi: 'සමස්ත ජීවිත රටාව හා පෞරුෂය',
      titleEn: 'Overall Life Pattern & Core Archetype',
      subtitleSi: 'මූලික පෞරුෂය, ශක්තීන්, අභියෝග සහ චින්තන රටාව',
      summarySi: `${lpArch.corePersonalitySi.substring(0, 160)}...`,
      contentSi: [
        lpArch.corePersonalitySi,
        `ඔබේ චින්තන රටාව සහ තීරණ ගැනීමේ විලාසය: ${lpArch.thinkingAndDecisionsSi}`,
        `සන්නිවේදන සහ සමාජශීලී ස්වභාවය: ${lpArch.communicationStyleSi}`,
        `ස්වාධීනත්වය සහ අනුවර්තනය: ඔබගේ අංක රටාව මගින් පෙන්වා දෙන්නේ ස්වයං විනයක් පවත්වා ගනිමින් අභියෝග හමුවේ නොසැලී සිටීමේ හැකියාවයි. තීරණ ගැනීමේදී ඔබ අනවශ්‍ය බියකින් තොරව කරුණු විමසා බලා ක්‍රියාත්මක වීමට ප්‍රිය කරයි.`
      ],
      keyPointsSi: [
        ...lpArch.strengthsSi.map(s => `ප්‍රධාන ශක්තිය: ${s}`),
        ...lpArch.challengesSi.map(c => `සැලකිලිමත් විය යුතු අභියෝගය: ${c}`)
      ]
    },

    // Section 3
    {
      id: 3,
      sectionNumber: 3,
      titleSi: 'අතීත අත්දැකීම් සහ සංවර්ධන මාවත',
      titleEn: 'Past Formative Patterns & Learned Lessons',
      subtitleSi: 'ළමා විය, පවුල් පරිසරය සහ හැඩගැසුණු සංධිස්ථාන',
      summarySi: 'අතීත අභියෝග හරහා ජීවිතයේ වැදගත්ම පාඩම් සහ ආත්ම ශක්තිය ප්‍රගුණ කරගත් අයුරු.',
      contentSi: [
        lpArch.pastTendenciesSi,
        'අංක විද්‍යාත්මක සංකේතාත්මක දෘෂ්ටිකෝණයෙන් බලන කල, ඔබගේ ළමා වියේදී හෝ තරුණ අවධියේදී පෞරුෂය හැඩගැස්වීමට බලපෑ ප්‍රධාන සාධකය වූයේ තමන්ගේ සැබෑ අභ්‍යන්තර හැකියාවන් තහවුරු කරගැනීමට සිදු වූ අරගලයයි.',
        'ඔබගේ අංක රටාව අනුව එවැනි අත්දැකීම් හරහා ඉගෙන ගැනීමේ සහ පන්නරය ලැබීමේ ප්‍රවණතාවක් පෙනේ. කිසිදු සිදුවීමක් අහම්බයක් නොවූ අතර, එම අත්දැකීම් ඔබ තුළ නොසැලෙන විනයක් සහ ගැඹුරු සහකම්පනයක් නිර්මාණය කිරීමට දායක වී ඇත.'
      ]
    },

    // Section 4
    {
      id: 4,
      sectionNumber: 4,
      titleSi: 'වර්තමාන ජීවිත අවධිය සහ බලපෑම්',
      titleEn: 'Present Life Phase & Current Energies',
      subtitleSi: 'වත්මන් වසරේ ශක්ති චක්‍රය සහ පුද්ගලික සංවර්ධනය',
      summarySi: `වත්මන් පෞද්ගලික වර්ෂ අංක ${profile.personalYear.number} අනුව නව අවස්ථා සහ වර්ධනයන් උදාවන කාලපරිච්ඡේදයකි.`,
      contentSi: [
        lpArch.presentPhaseSi,
        `වර්තමානයේ ඔබ පසුවන්නේ පුද්ගලික වර්ෂ අංක ${profile.personalYear.number} යටතේයි. මෙම වසරේ ප්‍රධාන ශක්තිය වන්නේ: ${pyArch.titleSi}.`,
        `වෘත්තීය සහ මූල්‍යමය වශයෙන් මෙම අවධියේදී පැරණි ගැටලු නිරාකරණය කරගැනීමට සහ ඉදිරි ගමන සඳහා සැලසුම් සකස් කිරීමට හිතකර පසුබිමක් නිර්මාණය වේ.`,
        `චිත්තවේගීය සමබරතාවය රැකගැනීමත්, පෞද්ගලික සබඳතා තුළ අනවශ්‍ය ආවේග පාලනය කරගැනීමත් මෙම කාලසීමාවේ සාර්ථකත්වයට මූලික රහස වේ.`
      ]
    },

    // Section 5
    {
      id: 5,
      sectionNumber: 5,
      titleSi: 'අනාගත විභවයන් සහ ගමන් මග',
      titleEn: 'Future Horizons & Unfolding Potentials',
      subtitleSi: 'ඉදිරි අවධීන්, සංක්‍රාන්ති කාලසීමාවන් සහ ඉඩප්‍රස්ථා',
      summarySi: 'අංක විද්‍යාත්මක චක්‍ර අනුව ඉදිරි වසරවලදී ඔබගේ නායකත්වය සහ උත්සාහය ඵලදරන අයුරු.',
      contentSi: [
        lpArch.futureThemesSi,
        'අනාගතය යනු කලින් තීරණය වූ ස්ථිර අනාවැකියක් නොව, ඔබගේ නිදහස් කැමැත්ත සහ අංක කම්පනයන්ගේ සුසංයෝගයෙන් නිර්මාණය වන අවස්ථාවන්ගේ එකතුවකි. අංක රටාව අනුව ඉදිරියේදී ස්ථාවර මූල්‍ය පදනමක් සහ සමාජ පිළිගැනීමක් ගොඩනැගීමේ ඉහළ විභවයක් පවතී.',
        'විශේෂයෙන් ඉදිරි අවුරුදු 2-4 තුළ සැලකිය යුතු සංක්‍රාන්ති කාලපරිච්ඡේදයක් උදාවිය හැකි අතර, එහිදී ඔබ ගන්නා උපායමාර්ගික තීරණ ඉදිරි දශකයේ දිශානතිය තීරණය කරනු ඇත.'
      ]
    },

    // Section 6
    {
      id: 6,
      sectionNumber: 6,
      titleSi: 'වෘත්තීය හා රැකියා මාවත',
      titleEn: 'Career, Profession & Workplace Excellence',
      subtitleSi: 'සුදුසු සේවා පරිසර, සහජ වෘත්තීය ශක්තීන් සහ නායකත්වය',
      summarySi: `${lpArch.careerEnvironmentsSi.substring(0, 150)}...`,
      contentSi: [
        `සුදුසු සේවා පරිසරයන්: ${lpArch.careerEnvironmentsSi}`,
        `ස්වභාවික වෘත්තීය ශක්තීන්: ${destArch.careerStrengthsSi.join(' | ')}`,
        'කණ්ඩායම් හැඟීම සහ සන්නිවේදනය: ඔබ කණ්ඩායමක් තුළ කටයුතු කිරීමේදී අනවශ්‍ය ගැටුම්වලින් තොරව පොදු ඉලක්කයක් කරා සියල්ලන් මෙහෙයවීමේ සහජ කුසලතාවක් දක්වයි.',
        'වෘත්තීය අභියෝග සහ වර්ධනය: ඒකාකාරී බවින් මිදී ඔබේ බුද්ධියට සහ නිර්මාණශීලීත්වයට අභියෝගයක් වන වගකීම් භාරගැනීම තුළින් ඔබේ වෘත්තීය දිවිය වඩාත් බැබළෙනු ඇත.'
      ],
      keyPointsSi: lpArch.careerStrengthsSi
    },

    // Section 7
    {
      id: 7,
      sectionNumber: 7,
      titleSi: 'ව්‍යාපාරික හා ව්‍යවසායකත්ව විභවය',
      titleEn: 'Business & Entrepreneurial Acumen',
      subtitleSi: 'අවදානම් කළමනාකරණය, හවුල්කාරිත්වයන් සහ තීරණ ගැනීම',
      summarySi: 'ව්‍යවසායකත්ව හැකියාව සහ මූල්‍ය ආයෝජන සැලසුම් සහගතව මෙහෙයවීම.',
      contentSi: [
        lpArch.businessPotentialSi,
        'අංක විද්‍යාත්මක දෘෂ්ටිකෝණයට අනුව, ව්‍යාපාරික ක්ෂේත්‍රයේදී ඔබගේ සාර්ථකත්වය රඳා පවතින්නේ විශ්වාසනීය සබඳතා සහ නීතිමය පදනම මතයි.',
        'හවුල්කාරිත්වයන්ට එළඹෙන්නේ නම්, අංක 1, 3, 5, 6, 8 වැනි ක්‍රියාශීලී හෝ මූල්‍යමය සංඛ්‍යාත්මක කම්පන දරන පුද්ගලයින් සමඟ කටයුතු කිරීමෙන් ව්‍යාපාරික ස්ථාවරත්වය තහවුරු කරගත හැක. (කෙසේ වෙතත්, මෙය සාර්ථකත්වයේ පරම සහතිකයක් නොවන අතර ප්‍රායෝගික ගිවිසුම් අත්‍යවශ්‍ය වේ).'
      ]
    },

    // Section 8
    {
      id: 8,
      sectionNumber: 8,
      titleSi: 'අධ්‍යාපනය හා ඉගෙනුම් විලාසය',
      titleEn: 'Education, Intellect & Learning Modalities',
      subtitleSi: 'ඒකාග්‍රතාවය, ශාස්ත්‍රීය දක්ෂතා සහ බුද්ධිමය නැඹුරුව',
      summarySi: `${lpArch.learningStyleSi.substring(0, 140)}...`,
      contentSi: [
        lpArch.learningStyleSi,
        'ඉගෙනුම් පරිසරය: අධික ඝෝෂාකාරී පරිසරයන්ට වඩා සන්සුන්, සංවිධානාත්මක පරිසරයක් තුළ අධ්‍යයන කටයුතු කිරීමෙන් ඔබගේ මතක ශක්තිය සහ අවබෝධය දෙගුණ තෙගුණ වේ.',
        'ශාස්ත්‍රීය ශක්තීන්: ප්‍රායෝගික උදාහරණ, තාර්කික විශ්ලේෂණ සහ ගැටලු විසඳීමේ අභ්‍යාස හරහා ඉගෙන ගැනීමට ඔබ විශේෂ දක්ෂතාවක් දක්වයි.'
      ]
    },

    // Section 9
    {
      id: 9,
      sectionNumber: 9,
      titleSi: 'ආදරය සහ ප්‍රේම සබඳතා',
      titleEn: 'Love, Romance & Emotional Harmony',
      subtitleSi: 'හැඟීම් ප්‍රකාශනය, බැඳීම් විලාසය සහ ආදරයේ අභියෝග',
      summarySi: `${soulArch.loveAndRomanceSi.substring(0, 150)}...`,
      contentSi: [
        soulArch.loveAndRomanceSi,
        `ඔබේ ආත්මීය ආශා අංකය (Soul Urge) ${profile.soulUrge.number} වන බැවින්, ආදරයේදී ඔබ මූලිකවම අපේක්ෂා කරන්නේ අවංකකම, අන්‍යෝන්‍ය ගෞරවය සහ හදවතේ ගැඹුරුම සෙනෙහසයි.`,
        'සබඳතාවල ශක්තිය සහ අභියෝග: ඇතැම් අවස්ථාවල ඔබේ සිතේ ඇති හැඟීම් වචනයට පෙරළීමට ඇති මැළිකම හෝ අධික සංවේදීතාව නිසා වැරදි වැටහීම් ඇතිවිය හැක. සහකරු සමඟ විවෘතව කතාබහ කිරීමෙන් ඕනෑම අර්බුදයක් පහසුවෙන් සමනය කරගත හැක.'
      ]
    },

    // Section 10
    {
      id: 10,
      sectionNumber: 10,
      titleSi: 'විවාහ ජීවිතය සහ යුග දිවිය',
      titleEn: 'Marriage, Partnership & Lasting Commitment',
      subtitleSi: 'පවුල් වගකීම්, චිත්තවේගීය ගැළපීම සහ හිතකර කාලවකවානු',
      summarySi: 'යුග දිවියේ සාමය, අන්‍යෝන්‍ය අවබෝධය සහ සාර්ථක පවුල් ජීවිතයක් සඳහා මාර්ගෝපදේශ.',
      contentSi: [
        lpArch.marriageTendenciesSi,
        'විවාහය යනු අංක විද්‍යාත්මකව ශක්තීන් දෙකක් එක්තැන් වන පූජනීය සංධිස්ථානයකි. පවුලේ ආර්ථික හා ගෘහස්ථ කටයුතු දෙදෙනා අතර බෙදාහදා ගැනීමෙන් දීර්ඝකාලීන සාමය රැකගත හැක.',
        'අංක චක්‍ර අනුව විවාහය හෝ ගැඹුරු සබඳතාවක් සඳහා වඩාත් හිතකර වන්නේ පෞද්ගලික වර්ෂ 2, 6, හෝ 8 වැනි සහයෝගීතාවය සහ පවුල් ශක්තිය වර්ධනය වන කාලපරිච්ඡේදයන්ය. (මෙය ස්ථිර අනාවැකියක් නොවන අතර ජීවන තීරණ ගැනීමේදී ප්‍රයෝජනවත් අනුබලයක් පමණි).'
      ]
    },

    // Section 11
    {
      id: 11,
      sectionNumber: 11,
      titleSi: 'අනාගත සහකරු/සහකාරියගේ ගුණාංග',
      titleEn: 'Archetypal Qualities of an Ideal Partner',
      subtitleSi: 'සංකේතාත්මක ගැළපීම, පෞරුෂ ලක්ෂණ සහ සබඳතා ගතිකත්වය',
      summarySi: `${destArch.partnerQualitiesSi.substring(0, 150)}...`,
      contentSi: [
        `සංකේතාත්මක පෞරුෂ ලක්ෂණ: ${destArch.partnerQualitiesSi}`,
        'සන්නිවේදනය සහ චිත්තවේග: ඔබට වඩාත් ගැළපෙන්නේ ඔබේ වේගයට බාධා නොකරන, නමුත් ආදරයෙන් ඔබව සන්සුන් කළ හැකි, ජීවිතය පිළිබඳ ප්‍රායෝගික හා සුබවාදී ආකල්ප ඇති සහකරුවෙකි.',
        'වැදගත් සටහන: මෙම විග්‍රහය සංඛ්‍යාත්මක අනුකූලතාවය මත පදනම් වූ සංකේතාත්මක ආදර්ශයක් (Archetype) වන අතර, යම් නිශ්චිත පුද්ගලයෙකු නම් කිරීමක් හෝ නියත අනාවැකියක් නොවේ.'
      ]
    },

    // Section 12
    {
      id: 12,
      sectionNumber: 12,
      titleSi: 'පවුල් ජීවිතය සහ ගෘහස්ථ පරිසරය',
      titleEn: 'Family Dynamics, Home Sanctuary & Responsibilities',
      subtitleSi: 'ගෘහස්ථ සාමය, පවුල් වගකීම් සහ සබඳතා ජාලය',
      summarySi: `${lpArch.familyDynamicsSi.substring(0, 150)}...`,
      contentSi: [
        lpArch.familyDynamicsSi,
        'ගෘහස්ථ පරිසරය ඔබගේ ශක්තිය නැවත ආරෝපණය වන ප්‍රධාන ක්ෂේමභූමියයි. නිවස පිළිවෙළකට සහ සෞන්දර්යාත්මකව තබා ගැනීමට ඔබ ප්‍රිය කරයි.',
        'පවුල් සබඳතාවලදී ඔබේ යුතුකම් නිසි ලෙස ඉටුකරන අතරම, අන්‍යයන්ගේ පෞද්ගලිකත්වයටද ඉඩදීම පවුලේ සතුට තවදුරටත් වර්ධනය කරයි.'
      ]
    },

    // Section 13
    {
      id: 13,
      sectionNumber: 13,
      titleSi: 'දෙමාපිය සබඳතා',
      titleEn: 'Relationship with Parents & Ancestral Resonance',
      subtitleSi: 'දෙමාපියන් කෙරෙහි ආකල්පය, යුතුකම් සහ චිත්තවේගීය බැඳීම',
      summarySi: `${lpArch.parentsRelationshipSi.substring(0, 140)}...`,
      contentSi: [
        lpArch.parentsRelationshipSi,
        'අංක විද්‍යාත්මක රටාව අනුව දෙමාපියන්ගේ ආශිර්වාදය සහ මඟපෙන්වීම ඔබගේ ජීවිතයේ ප්‍රධාන බාධක ජයගැනීමට මහඟු ශක්තියක් සපයයි.',
        'ඇතැම් විට අදහස්වල වෙනස්කම් ඇතිවුවද, ගැඹුරු කෘතවේදීත්වයකින් සහ ගෞරවයකින් කටයුතු කිරීම ඔබේ ආත්මීය දියුණුවට මගපාදයි.'
      ]
    },

    // Section 14
    {
      id: 14,
      sectionNumber: 14,
      titleSi: 'දරුවන් සහ මාපිය භූමිකාව',
      titleEn: 'Children & Parenthood Approach',
      subtitleSi: 'මාපිය විලාසය, සෙනෙහස සහ පරපුරට දායාද කරන ගුණාංග',
      summarySi: `${lpArch.parenthoodStyleSi.substring(0, 150)}...`,
      contentSi: [
        lpArch.parenthoodStyleSi,
        'දරුවන් ඇතිදැඩි කිරීමේදී ඔබ ආදරය සහ විනය සමබරව පවත්වා ගැනීමට උත්සාහ කරනු ඇත. ඔවුන් තුළ ස්වාධීන චින්තනය සහ සදාචාරාත්මක අගයන් ගොඩනැගීමට ඔබ විශේෂ උනන්දුවක් දක්වයි.',
        'සදාචාරාත්මක වගකීම: අංක විද්‍යාව මගින් අනාගත දරුවන්ගේ නිශ්චිත සංඛ්‍යාවක් හෝ සරුභාවය පිළිබඳ අනාවැකි පළ නොකරන අතර, මෙය දරුවන් සමඟ පවත්වා ගත හැකි ආදරණීය සබඳතාවයේ සංකේතාත්මක ස්වභාවය පමණක් විග්‍රහ කරයි.'
      ]
    },

    // Section 15
    {
      id: 15,
      sectionNumber: 15,
      titleSi: 'මූල්‍ය ජීවිතය සහ ධන ආකර්ෂණය',
      titleEn: 'Financial Flow, Wealth Psychology & Discipline',
      subtitleSi: 'මුදල් කළමනාකරණය, ආයෝජන, ඉතිරිකිරීම් සහ අවදානම්',
      summarySi: `${lpArch.financialTendenciesSi.substring(0, 150)}...`,
      contentSi: [
        lpArch.financialTendenciesSi,
        'මුදල් පිළිබඳ මනෝභාවය: ඔබ මුදල් සලකන්නේ හුදෙක් පරිභෝජනයට වඩා නිදහස සහ ස්ථාවරත්වය ලබාදෙන මාධ්‍යයක් වශයෙනි.',
        'ක්‍රමානුකූල මූල්‍ය සැලසුම්කරණය, හදිසි අරමුදලක් පවත්වා ගැනීම සහ අනවශ්‍ය හැඟීම්බර වියදම් පාලනය කරගැනීම මගින් ඔබට විශිෂ්ට ධනවත් භාවයක් ළඟා කරගත හැක. (කිසිදු ආකාරයකින් ක්‍ෂණික හෝ සහතික කළ ධන උල්පත් ප්‍රකාශ නොකෙරේ).'
      ]
    },

    // Section 16
    {
      id: 16,
      sectionNumber: 16,
      titleSi: 'වාසනාවන්ත සහ සුබදායක අංක',
      titleEn: 'Auspicious Numbers & Harmonic Resonance',
      subtitleSi: 'හිතකර අංක, අනුබල දෙන සංඛ්‍යා සහ සංකේතාත්මක වැදගත්කම',
      summarySi: `ඔබට වඩාත් සුබදායක අංක වන්නේ: ${lpArch.luckyNumbers.join(', ')} වේ.`,
      contentSi: [
        `ප්‍රධාන සුබදායක අංක: ${lpArch.luckyNumbers.join(', ')}`,
        `අතිරේක අනුබල දෙන අංක: ${[profile.birthday.number, profile.destiny.number, profile.personalYear.number].filter((v, i, a) => a.indexOf(v) === i).join(', ')}`,
        `හේතු සාධක සහ විග්‍රහය: ${lpArch.luckyNumbersReasonSi}`,
        'මෙම අංක වැදගත් කටයුතු ආරම්භ කිරීම, දින තෝරාගැනීම හෝ සංකේතාත්මක තේරීම් සඳහා සුබදායක පෙළඹවීමක් ලෙස භාවිත කළ හැක.'
      ],
      tableData: [
        { label: 'ප්‍රමුඛ අංක', value: lpArch.luckyNumbers.join(', ') },
        { label: 'අනුබල දෙන අංක', value: `${profile.birthday.number}, ${profile.destiny.number}` },
        { label: 'වත්මන් වසරේ අංකය', value: `${profile.personalYear.number}` }
      ]
    },

    // Section 17
    {
      id: 17,
      sectionNumber: 17,
      titleSi: 'සුබදායක දින සහ හෝරාවන්',
      titleEn: 'Favorable Days & Harmonious Timing',
      subtitleSi: 'සතියේ වඩාත් පලදායී දින සහ ක්‍රියාකාරී හෝරාවන්',
      summarySi: `ඔබට වඩාත් පලදායී දින වන්නේ: ${lpArch.luckyDays.join(' සහ ')} වේ.`,
      contentSi: [
        `සුබදායක දින: ${lpArch.luckyDays.join(', ')}`,
        `විග්‍රහය සහ පදනම: ${lpArch.luckyDaysReasonSi}`,
        'වැදගත් ගිවිසුම් අත්සන් කිරීම, නව ව්‍යාපාර ඇරඹීම හෝ තීරණාත්මක සාකච්ඡා සඳහා මෙම දිනවල උදෑසන හෝ සවස් භාගය තෝරාගැනීම වඩාත් පලදායී ප්‍රතිඵල අත්කර දෙනු ඇත.'
      ]
    },

    // Section 18
    {
      id: 18,
      sectionNumber: 18,
      titleSi: 'වාසනාවන්ත වර්ණ සහ ආලෝක ශක්තිය',
      titleEn: 'Auspicious Colors & Energy Shades',
      subtitleSi: 'පෞරුෂය ආලෝකමත් කරන වර්ණ සහ මානසික සුවය',
      summarySi: `ඔබේ ප්‍රධාන සුබ වර්ණ: ${lpArch.luckyColors.join(', ')} වේ.`,
      contentSi: [
        `ප්‍රමුඛ සුබ වර්ණ: ${lpArch.luckyColors.join(', ')}`,
        `ශක්තිමය විග්‍රහය: ${lpArch.luckyColorsReasonSi}`,
        'ඔබේ ඇඳුම් පැළඳුම්, නිවසේ හෝ සේවා ස්ථානයේ අලංකරණය සඳහා මෙම වර්ණ භාවිත කිරීමෙන් ඔබේ මනස ප්‍රබෝධමත් වන අතර ආකර්ෂණීය ශක්තිය ඉහළ නංවයි.'
      ]
    },

    // Section 19
    {
      id: 19,
      sectionNumber: 19,
      titleSi: 'නාම අක්ෂර බලපෑම',
      titleEn: 'Name Letter Vibrations & Subconscious Triggers',
      subtitleSi: 'කෝනස්ටෝන් (Cornerstone), කැප්ස්ටෝන් (Capstone) සහ ප්‍රථම ස්වරය',
      summarySi: `ප්‍රථම අක්ෂරය (${profile.cornerstone.letter}): ${profile.cornerstone.meaningSi}`,
      contentSi: [
        `ප්‍රථම අක්ෂරය - කෝනස්ටෝන් (Cornerstone: ${profile.cornerstone.letter}): මෙය ඔබ නව අවස්ථා හෝ අභියෝග හමුවට පැමිණෙන විට දක්වන පළමු ප්‍රතිචාරය සංකේතවත් කරයි. විග්‍රහය: ${profile.cornerstone.meaningSi}`,
        `අවසාන අක්ෂරය - කැප්ස්ටෝන් (Capstone: ${profile.capstone.letter}): මෙය ඔබ ආරම්භ කළ කාර්යයක් අවසානය දක්වා ගෙන යන ආකාරය සහ ප්‍රතිඵලය නෙළාගන්නා විලාසය පෙන්වයි. විග්‍රහය: ${profile.capstone.meaningSi}`,
        `ප්‍රථම ස්වර අක්ෂරය (First Vowel: ${profile.firstVowel.letter}): මෙය ඔබගේ ගැඹුරුම චිත්තවේගීය ප්‍රේරකයයි. විග්‍රහය: ${profile.firstVowel.meaningSi}`,
        `නාමයේ අඩංගු අක්ෂර ව්‍යාප්තිය: අංක 1-9 දක්වා අක්ෂරවලින් වඩාත්ම ප්‍රමුඛ සංඛ්‍යා සහ ශක්ති සම්ප්‍රේෂණයන් ඔබගේ නාමය පුරා විසිරී පවතී.`
      ]
    },

    // Section 20
    {
      id: 20,
      sectionNumber: 20,
      titleSi: 'නාම සංසන්දනය සහ ශක්ති සමතුලිතතාවය',
      titleEn: 'Name Balance, Common vs Legal Name Analysis',
      subtitleSi: 'උප්පැන්න නාමය සහ භාවිත නාමය අතර සංසන්දනය හා උපදෙස්',
      summarySi: nameAnalysisSi.substring(0, 150) + '...',
      contentSi: [
        nameAnalysisSi,
        `උප්පැන්න සහතිකයේ නම: ${input.legalName} -> අංකය: ${profile.nameNumber.number} (${profile.nameNumber.archetypeSi})`,
        `දෛනික භාවිත නම: ${input.commonName} -> අංකය: ${profile.commonNameNumber.number} (${profile.commonNameNumber.archetypeSi})`,
        nameAdviceSi
      ]
    },

    // Section 21
    {
      id: 21,
      sectionNumber: 21,
      titleSi: 'වැදගත් ජීවිත කාලසීමාවන් සහ වසර චක්‍ර',
      titleEn: 'Important Life Periods & Yearly Timeline Cycles',
      subtitleSi: 'ඉදිරි වසර 8 සඳහා වාර්ෂික අංක චක්‍ර සහ ක්‍රියාකාරී තේමාවන්',
      summarySi: `ඉදිරි වසර 8 සඳහා පෞද්ගලික වර්ෂ චක්‍ර මගින් නිරූපණය වන ප්‍රධාන ජීවන තේමාවන්.`,
      contentSi: [
        'අංක විද්‍යාත්මක චක්‍ර පදනම් වන්නේ වසර 9 කින් යුත් සංවර්ධන වටයක් මතය. සෑම වසරකටම ආවේණික වූ මූලික ශක්තියක් සහ අවධානය යොමු කළ යුතු ප්‍රධාන ක්ෂේත්‍රයක් පවතී.',
        ...timeline.map(
          t => `${t.year} වසර [පෞද්ගලික වර්ෂය ${t.personalYearNumber}]: ${t.themeSi} | අවධානය: ${t.focusSi} | උපදෙස: ${t.adviceSi}`
        )
      ],
      tableData: timeline.map(t => ({
        label: `${t.year} (අංක ${t.personalYearNumber})`,
        value: t.themeSi,
        notes: t.adviceSi
      }))
    },

    // Section 22
    {
      id: 22,
      sectionNumber: 22,
      titleSi: 'අවසාන ජීවිත සාරාංශය සහ නේත්‍රා ආශිර්වාදය',
      titleEn: 'Final Life Synthesis & NETHRA Closing Wisdom',
      subtitleSi: 'ප්‍රධාන හරය, ප්‍රබලතම ශක්තීන්, අභියෝග සහ ජීවන අවවාදය',
      summarySi: 'ඔබගේ අංක රටාවේ පූර්ණ සාරාංශය සහ නේත්‍රා ආයතනික ආශිර්වාදය.',
      contentSi: [
        `ප්‍රබලතම සහජ ගුණාංග: ${lpArch.strengthsSi.slice(0, 3).join(', ')}`,
        `ප්‍රධානම අභියෝගය සහ අවධානය: ${lpArch.challengesSi[0]}`,
        `වෘත්තීය සහ මූල්‍ය මඟපෙන්වීම: ඔබගේ සහජ ශක්තීන්ට උචිත ස්වාධීන හෝ කණ්ඩායම් ක්ෂේත්‍ර තෝරාගනිමින් ක්‍රමානුකූල මූල්‍ය විනයක් පවත්වා ගැනීම.`,
        `සබඳතා සහ යුග දිවිය: විවෘත සන්නිවේදනය සහ අන්‍යෝන්‍ය ගෞරවය මත පදනම් වූ සාමකාමී පවුල් පරිසරයක් ගොඩනැගීම.`,
        `අනාගත දර්ශනය: ඉදිරි වසර කිහිපය තුළ ඔබ ගන්නා සංවිධානාත්මක පියවර මගින් ඔබගේ ජීවිතයේ ස්ථාවරම සහ ඉහළම ඵලදායී කාලසීමාව උදාකරගත හැක.`,
        `ප්‍රධාන ජීවන අවවාදය: "ඔබගේ අංක යනු සීමාවක් නොව, ඔබ තුළ නිදන්ගතව ඇති අසීමිත විභවය හඳුනාගැනීමට ඔබට ලැබුණු ආලෝකයකි. විශ්වාසයෙන් යුතුව ඔබේ මාවතේ ඉදිරියට යන්න."`,
        `නේත්‍රා (NETHRA) ආශිර්වාදය: "ඔබගේ අංකවලින් ඔබේ සැබෑ මාවත හඳුනාගෙන, සාමය, සෞභාග්‍යය සහ සදාකාලික ආලෝකයෙන් පිරි ජීවිතයක් ගෙවීමට ඔබට ආශිර්වාද වේවා!"`
      ]
    }
  ];

  return {
    id: `NETHRA-${Date.now()}`,
    createdAt: new Date().toISOString(),
    customerInput: input,
    profile,
    sections,
    timeline,
    luckyFactors: {
      numbers: lpArch.luckyNumbers,
      numbersExplanationSi: lpArch.luckyNumbersReasonSi,
      days: lpArch.luckyDays,
      daysExplanationSi: lpArch.luckyDaysReasonSi,
      colors: lpArch.luckyColors,
      colorsExplanationSi: lpArch.luckyColorsReasonSi
    },
    nameComparison: {
      legalName: input.legalName,
      legalNumber: profile.nameNumber.number,
      commonName: input.commonName,
      commonNumber: profile.commonNameNumber.number,
      isHarmonious,
      analysisSi: nameAnalysisSi,
      adviceSi: nameAdviceSi
    },
    summary: {
      strongestQualities: lpArch.strengthsSi.slice(0, 4),
      biggestChallenges: lpArch.challengesSi.slice(0, 3),
      careerDirection: lpArch.careerEnvironmentsSi,
      relationshipTheme: soulArch.loveAndRomanceSi,
      marriageTheme: lpArch.marriageTendenciesSi,
      familyTheme: lpArch.familyDynamicsSi,
      financialTheme: lpArch.financialTendenciesSi,
      futureTheme: lpArch.futureThemesSi,
      nameTheme: nameAnalysisSi,
      keyAdvice: `ඔබගේ ප්‍රධාන අංක ${profile.lifePath.number} හි නායකත්ව සහ ප්‍රඥා ශක්තිය උපයෝගී කරගනිමින්, ආචාරධර්මීයව සහ නොසැලෙන ආත්ම විශ්වාසයෙන් යුතුව ඔබේ අරමුණු කරා පියවර තබන්න.`,
      closingBlessingSi:
        'ඔබේ අංකවලින් ඔබේ මාවත හඳුනාගෙන, සෞභාග්‍යය සහ ආලෝකයෙන් පිරි යහපත් ජීවිතයක් උදා වේවා!'
    }
  };
}
