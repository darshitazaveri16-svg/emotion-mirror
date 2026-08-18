# Emotion Mirror

AI-powered emotional understanding platform with real Gemini AI integration.

## Current status — Phase 6

- React (Vite) frontend with routing and layout
- Node.js + Express backend with modular architecture
- **Gemini AI integration** — Google Gemini Free Tier for emotional analysis
- **Shared AI Engine** — unified pipeline for all three modes
- **Live Conversation mode** — real-time messaging + AI emotional mirror via Socket.IO
- **Private Mirror mode** — shared conversation + per-participant private AI panels (neon UI, AI-powered)
- **Solo Reflection mode** — paste/describe conversation analysis with AI insights (neon UI, AI-powered)
- Share Reflection, shared neutral reflection, optional communication suggestion
- No MongoDB, authentication, or OCR yet
- AI features use uncertainty-aware language and fallback to demo data if Gemini unavailable

## AI Configuration

Phase 6 requires a Gemini API key for real AI analysis.

1. Get a free API key from: https://makersuite.google.com/app/apikey
2. Create `server/.env` file with:
```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```
3. Restart the server

Without a configured API key, the application falls back to demo data with clear labeling.

## Run locally

Install dependencies:

```bash
npm run install:all
```

Start the API (port 4000):

```bash
npm run dev:server
```

Start the frontend (port 5173):

```bash
npm run dev:client
```

Health check: `http://localhost:4000/health`

## Live Conversation flow (Phase 3 + Phase 6 AI)

1. `/live` — create session (name + conversation type)
2. `/live/waiting/:code` — host sees session code and invite link
3. `/live/join/:code` — guest consent + join
4. `/live/room/:code` — three-panel live room (AI mirror updates real-time, temperature demo, real messages)
5. `/live/ended/:code` — conversation ended

## Private Mirror flow (Phase 4 + Phase 6 AI)

1. `/private` — create private room
2. `/private/waiting/:code` — host sees code and invite link
3. `/private/join/:code` — guest privacy acknowledgement + join
4. `/private/room/:code` — shared conversation + private neon AI panel (per participant, AI-powered)
5. `/private/complete/:code` — Share Reflection → shared neutral reflection → optional suggestion

## Solo Reflection flow (Phase 5 + Phase 6 AI)

1. `/solo` — choose input method (Paste Conversation, Describe What Happened, Upload Screenshot)
2. Paste or Describe → AI analysis with Gemini
3. Results page → 7 analysis panels with neon AI theme
4. Screenshot upload remains a placeholder (OCR not implemented)

Test scripts (server running on :4000):

```bash
npm run test:live --prefix server
npm run test:private --prefix server
```

## Spec

Product requirements live in `explaination_emo_mirror.pdf`.

## AI Safety

All AI outputs use uncertainty-aware language:
- "may indicate"
- "could reflect"
- "possible interpretation"
- "might suggest"

The AI never claims to know another person's actual feelings and avoids diagnosis, mind-reading, or declaring who is right.

## Future database rule

When persistence is added, use **MongoDB Atlas only** via environment variables — never local MongoDB.
