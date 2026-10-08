import { CompleteReading } from '../types/reading';

const STORAGE_KEY = 'nethra_reading_history_v1';

export interface ReadingHistoryItem {
  id: string;
  customerLegalName: string;
  customerCommonName: string;
  birthDate: string;
  birthTime?: string;
  lifePathNumber: number;
  destinyNumber: number;
  personalYearNumber: number;
  createdAt: string;
  readingData: CompleteReading;
}

export function getHistory(): ReadingHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse history:', e);
    return [];
  }
}

export function saveReadingToHistory(reading: CompleteReading): void {
  try {
    const history = getHistory();
    const item: ReadingHistoryItem = {
      id: reading.id,
      customerLegalName: reading.customerInput.legalName,
      customerCommonName: reading.customerInput.commonName,
      birthDate: reading.customerInput.birthDate,
      birthTime: reading.customerInput.birthTime,
      lifePathNumber: reading.profile.lifePath.number,
      destinyNumber: reading.profile.destiny.number,
      personalYearNumber: reading.profile.personalYear.number,
      createdAt: reading.createdAt || new Date().toISOString(),
      readingData: reading,
    };

    // Filter out if already exists, then unshift
    const filtered = history.filter(h => h.id !== item.id);
    filtered.unshift(item);

    // Keep up to 100 readings
    const trimmed = filtered.slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save reading:', e);
  }
}

export function deleteReadingFromHistory(id: string): void {
  try {
    const history = getHistory();
    const filtered = history.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete reading:', e);
  }
}

export function getReadingById(id: string): CompleteReading | null {
  const history = getHistory();
  const match = history.find(h => h.id === id);
  return match ? match.readingData : null;
}

export function exportHistoryJson(): string {
  return JSON.stringify(getHistory(), null, 2);
}

export function importHistoryJson(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return true;
    }
  } catch (e) {
    console.error('Failed to import history:', e);
  }
  return false;
}
