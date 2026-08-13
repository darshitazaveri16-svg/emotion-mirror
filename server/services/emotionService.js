const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    responseMimeType: 'application/json'
  }
});

const analyzeEmotion = async (message) => {
  const prompt = `
You are the AI emotion analysis engine for an application called Emotion Mirror.

Your job is NOT to claim that you know someone's actual emotions.
You must only identify possible emotional signals from the message.

Analyze this message:

"${message}"

Return ONLY valid JSON with exactly these fields:

{
  "emotion": "one primary possible emotion",
  "intensity": 0.0,
  "temperature": 0,
  "trend": "rising | falling | stable",
  "reasoning": "short explanation of why this emotional signal may be present",
  "note": "AI interpretation — not a fact"
}

Rules:
- emotion should describe a possible emotional signal such as hurt, anger, frustration, sadness, anxiety, defensiveness, disappointment, withdrawal, etc.
- intensity must be a number between 0 and 1.
- temperature must be a number between 0 and 100.
- trend must be exactly one of: rising, falling, stable.
- Do not diagnose mental health conditions.
- Do not say that the person definitely feels something.
- Use uncertainty-aware language such as "may", "might", or "could".
- Keep reasoning short and understandable.
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  return JSON.parse(text);
};

module.exports = { analyzeEmotion };