import { CompleteReading, CustomerInput } from '../types/reading';
import { generateCompleteReading } from '../numerology/reportGenerator';

export async function requestNumerologyReading(
  input: CustomerInput
): Promise<CompleteReading> {
  try {
    const response = await fetch('/api/generate-reading', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.reading) {
        return data.reading;
      }
    }
    console.warn('API returned non-ok status, using internal client engine fallback');
  } catch (err) {
    console.warn('Server endpoint unreachable or offline, using client numerology engine:', err);
  }

  // Resilient fallback to deterministic client engine
  return generateCompleteReading(input);
}

export async function checkServerHealth(): Promise<{ aiEnabled: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      return { aiEnabled: !!data.aiEnabled };
    }
  } catch (e) {
    // offline or static preview
  }
  return { aiEnabled: false };
}
