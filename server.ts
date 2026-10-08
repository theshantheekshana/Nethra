import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { generateCompleteReading } from './src/numerology/reportGenerator';
import { CustomerInput } from './src/types/reading';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility on the server
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NETHRA Numerology Engine',
    aiEnabled: !!aiClient,
    timestamp: new Date().toISOString(),
  });
});

// Primary Numerology Life Reading generation endpoint
app.post('/api/generate-reading', async (req, res) => {
  try {
    const { legalName, commonName, birthDate, birthTime } = req.body;

    if (!legalName || !commonName || !birthDate) {
      return res.status(400).json({
        error: 'Full Legal Name, Common Name, and Birth Date are required.',
      });
    }

    const input: CustomerInput = {
      legalName: String(legalName).trim().toUpperCase(),
      commonName: String(commonName).trim().toUpperCase(),
      birthDate: String(birthDate).trim(),
      birthTime: birthTime ? String(birthTime).trim() : undefined,
    };

    // Calculate complete numerology report
    const reading = generateCompleteReading(input);

    // If Gemini AI client is configured, enhance the executive summary & synthesis with deep Sinhala tailoring
    if (aiClient) {
      try {
        const prompt = `
You are the senior Sri Lankan Sinhala Numerology master consultant for NETHRA ("ඔබේ අංකවලින් ඔබේ මාවත හඳුනාගන්න").
Customer:
- Full Legal Name: ${input.legalName}
- Common / Calling Name: ${input.commonName}
- Date of Birth: ${input.birthDate}
- Birth Time: ${input.birthTime || 'Not provided'}
- Life Path Number: ${reading.profile.lifePath.number} (${reading.profile.lifePath.archetypeSi})
- Destiny Number: ${reading.profile.destiny.number}
- Soul Urge: ${reading.profile.soulUrge.number}
- Personality: ${reading.profile.personality.number}
- Personal Year: ${reading.profile.personalYear.number}

Provide an elegant, deeply personal, human-written Sinhala life synthesis advice (maximum 3 paragraphs in natural, refined, respectful Sinhala).
Do NOT use robotic AI phrases. Write with warm dignity and wisdom. Important English numerology terms in brackets if used.
Include:
1. Core spiritual/karmic harmony between the legal name and common calling name.
2. Key guidance for their current personal year cycle.
3. An inspiring closing blessing.
`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const enhancedText = response.text?.trim();
        if (enhancedText) {
          reading.summary.keyAdvice = enhancedText;
        }
      } catch (aiErr) {
        console.warn('Gemini enhancement skipped due to notice/quota; using pure deterministic engine:', aiErr);
      }
    }

    return res.json({
      success: true,
      reading,
    });
  } catch (error: any) {
    console.error('Error generating numerology reading:', error);
    return res.status(500).json({
      error: 'Failed to generate numerology reading',
      details: error?.message || String(error),
    });
  }
});

// Mount Vite or static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`NETHRA server running at http://localhost:${PORT}`);
  });
}

startServer();
