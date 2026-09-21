import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('Failed to initialize Gemini client:', err);
      aiClient = null;
    }
  }
  return aiClient;
}

// ==========================================
// AI & ANALYTICS API ENDPOINTS
// ==========================================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 2. AI Press Conference Generator
app.post('/api/ai/press-conference', async (req, res) => {
  const { careerName, club, mode, recentResult, opponent, score, leagueFinish, season } = req.body;

  const ai = getAI();
  if (ai) {
    try {
      const prompt = `You are an EA Sports FC / FIFA press officer.
The manager/player is at a press conference after a match.
Career mode: ${mode}
Club: ${club}
Recent match: Against ${opponent || 'rivals'}, Score: ${score || '2-1'} (${recentResult || 'W'})
Season: ${season || '2025/26'}

Generate a realistic, immersive press conference with 3 journalists' questions.
For each question, provide 3 multiple-choice response options for the user (Motivating, Critical, Calm/Diplomatic) with the projected morale impact (+5% Morale, -5% Confidence, etc).

Respond strictly in valid JSON with this schema:
{
  "headline": "string",
  "questions": [
    {
      "id": "q1",
      "journalist": "string (e.g. Fabrizio Romano, Sky Sports, The Athletic)",
      "question": "string",
      "options": [
        { "text": "string", "moraleImpact": "+5% Team Morale", "trait": "Calm" },
        { "text": "string", "moraleImpact": "+8% Attackers / -3% Defense", "trait": "Passionate" },
        { "text": "string", "moraleImpact": "-5% Board Confidence", "trait": "Critical" }
      ]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    } catch (err: any) {
      console.error('Gemini error in press conference:', err);
      // Fallback below
    }
  }

  // Fallback high-fidelity procedural response if no key or API error
  const fallback = {
    headline: `${club} Press Room: Post-Match Reaction vs ${opponent || 'Rivals'}`,
    questions: [
      {
        id: 'q1',
        journalist: 'David Ornstein (The Athletic)',
        question: `Gaffer, after that ${recentResult === 'W' ? 'commanding victory' : 'demanding test'} against ${opponent || 'the opponent'}, how would you assess the squad's tactical discipline?`,
        options: [
          { text: 'The lads executed the gameplan to perfection. Outstanding work rate across all 90 minutes.', moraleImpact: '+6% Team Spirit', trait: 'Inspiring' },
          { text: 'We got the job done, but standards must remain higher if we want to lift silverware.', moraleImpact: '+3% Focus', trait: 'Demanding' },
          { text: 'We take it one game at a time. The focus immediately shifts to next week.', moraleImpact: '+2% Composure', trait: 'Diplomatic' },
        ],
      },
      {
        id: 'q2',
        journalist: 'Sky Sports Football',
        question: `There are whispers in the tunnel about potential squad rotation ahead of the upcoming cup fixtures. Can your bench deliver?`,
        options: [
          { text: 'Every single player in this locker room has my 100% trust. No one is left behind.', moraleImpact: '+8% Bench Morale', trait: 'Supportive' },
          { text: 'Competition for places is fierce. Only those performing in training will earn the shirt.', moraleImpact: '+5% Intensity', trait: 'Firm' },
          { text: 'We have enough depth to fight on all fronts this season.', moraleImpact: '+4% Confidence', trait: 'Balanced' },
        ],
      },
      {
        id: 'q3',
        journalist: 'Fabrizio Romano',
        question: `The transfer window buzz is intensifying. Will ${club} be active in signing reinforcements before the deadline?`,
        options: [
          { text: 'Our scouting department is working overtime. If the right profile emerges, we strike.', moraleImpact: '+5% Fan Excitement', trait: 'Ambitious' },
          { text: 'I am completely satisfied with the group we have right here.', moraleImpact: '+4% Squad Loyalty', trait: 'Loyal' },
          { text: 'No comments on rumors. We do our business behind closed doors.', moraleImpact: 'Neutral', trait: 'Guarded' },
        ],
      },
    ],
  };

  return res.json(fallback);
});

// 3. AI Scout & Wonderkid Recommendation
app.post('/api/ai/scout-report', async (req, res) => {
  const { position, country, budget, minOverall, playstyle } = req.body;

  const ai = getAI();
  if (ai) {
    try {
      const prompt = `You are a Chief Scout for EA Sports FC / FIFA Career Mode.
Generate 3 realistic scouting targets (wonderkids or stars) matching:
Position: ${position || 'Any'}
Region/Country: ${country || 'Global'}
Budget: ${budget ? `€${budget}` : 'Flexible'}
Preferred style: ${playstyle || 'Technically gifted'}

Provide realistic EA FC style data including: name, age, club, nation, OVR, POT, estimated value, signature playstyle, and scout breakdown.
Respond strictly in JSON with this schema:
{
  "reportTitle": "string",
  "scoutNotes": "string",
  "targets": [
    {
      "name": "string",
      "age": number,
      "position": "string",
      "club": "string",
      "nationality": "string",
      "overall": number,
      "potential": number,
      "value": number,
      "wage": number,
      "signaturePlaystyle": "string (e.g. Finesse Shot+, Incisive Pass+, Rapid+)",
      "pros": ["string", "string"],
      "comparison": "string (e.g. Reminiscent of young De Bruyne)"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    } catch (err: any) {
      console.error('Gemini scouting error:', err);
    }
  }

  // Fallback procedural scout report
  const targetsPool = [
    {
      name: 'Franco Mastantuono',
      age: 18,
      position: 'CAM',
      club: 'River Plate',
      nationality: 'Argentina',
      overall: 76,
      potential: 91,
      value: 16500000,
      wage: 15000,
      signaturePlaystyle: 'Dead Ball+ & Incisive Pass',
      pros: ['Exquisite left foot delivery', 'Unlocks low blocks with ease'],
      comparison: 'Echoes of Paulo Dybala with raw agility',
    },
    {
      name: 'Guillaume Restes',
      age: 20,
      position: 'GK',
      club: 'Toulouse FC',
      nationality: 'France',
      overall: 78,
      potential: 89,
      value: 22000000,
      wage: 24000,
      signaturePlaystyle: 'Footwork+ & Far Throw',
      pros: ['Cat-like reflexes in 1v1 situations', 'Commands penalty box'],
      comparison: 'The modern French successor to Hugo Lloris',
    },
    {
      name: 'Antonio Nusa',
      age: 20,
      position: 'LW',
      club: 'RB Leipzig',
      nationality: 'Norway',
      overall: 77,
      potential: 88,
      value: 21000000,
      wage: 28000,
      signaturePlaystyle: 'Trickster+ & Rapid',
      pros: ['Devastating acceleration in transition', '5-star skill moves capability'],
      comparison: 'Explosive wing play comparable to young Sadio Mané',
    },
  ];

  return res.json({
    reportTitle: `Global Scouting Dossier: ${position || 'Wonderkids'} Focus`,
    scoutNotes: `Our scouts identified high-ceiling targets with immense potential growth curves who fit modern high-intensity tactical systems.`,
    targets: targetsPool,
  });
});

// 4. AI Match Tactical Gameplan
app.post('/api/ai/match-tactics', async (req, res) => {
  const { club, opponent, formation, isHome, competition } = req.body;

  const ai = getAI();
  if (ai) {
    try {
      const prompt = `You are a tactical master and assistant coach in EA Sports FC / FIFA.
Give a match tactical preview and gameplan for:
Our Club: ${club} (Formation: ${formation || '4-3-3'})
Opponent: ${opponent}
Venue: ${isHome ? 'Home Ground' : 'Away Stadium'}
Competition: ${competition || 'League'}

Return JSON:
{
  "keyBattle": "string",
  "suggestedTacticalStyle": "string (e.g. Gegenpressing, Wing Play, Tiki-Taka, Counter-Attack)",
  "recommendedInstructions": [
    { "role": "string", "instruction": "string" }
  ],
  "threatAnalysis": "string",
  "winProbability": number (e.g. 62)
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    } catch (err: any) {
      console.error('Gemini tactical error:', err);
    }
  }

  return res.json({
    keyBattle: `Midfield Transition: Dominating the second balls against ${opponent}'s pivot`,
    suggestedTacticalStyle: isHome ? 'Gegenpress & Controlled Possession' : 'Fast Break Counter-Attack',
    recommendedInstructions: [
      { role: 'Wingers', instruction: 'Cut Inside & Get in Behind defensive line' },
      { role: 'Holding Midfielder', instruction: 'Stay Back While Attacking & Cover Center' },
      { role: 'Full Backs', instruction: 'Overlap on wide overloads during offensive phase' },
    ],
    threatAnalysis: `${opponent} poses high danger from wide deliveries and set pieces. Maintain compactness in our defensive third.`,
    winProbability: isHome ? 68 : 54,
  });
});

// ==========================================
// VITE MIDDLEWARE & STATIC SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FIFA Career Mode Tracker server running on port ${PORT}`);
  });
}

startServer();
