const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-3.6-flash',
  generationConfig: {
    responseMimeType: 'application/json',
  },
});

const analyzeEmotion = async (message, context = '') => {
  const prompt = `
You are the AI emotion analysis engine for Emotion Mirror.

Analyze possible emotional signals only.
Do NOT claim to know the person's actual emotion.
Do NOT diagnose mental health conditions.

Previous conversation context:
${context || 'No previous context.'}

Current message:
"${message}"

Return ONLY valid JSON:

{
  "emotion": "one possible primary emotional signal",
  "intensity": 0.0,
  "temperature": 0,
  "trend": "rising | falling | stable",
  "reasoning": "short explanation",
  "note": "AI interpretation — not a fact",
  "turningPoint": false
}

Rules:
- intensity must be between 0 and 1
- temperature must be between 0 and 100
- trend must be exactly rising, falling, or stable
- turningPoint must be true only if this message appears to be an important emotional shift
- use uncertainty-aware language
- never diagnose
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(text);
};


const generateAIReply = async (
  message,
  language = 'en',
  emotion = 'neutral',
  context = ''
) => {
  const languageName = {
    en: 'English',
    hi: 'Hindi',
    gu: 'Gujarati',
  }[language] || 'English';

  const prompt = `
You are Emotion Mirror, an empathetic AI reflection assistant.

Reply to the user's message in ${languageName}.

Possible emotional signal:
${emotion}

Previous context:
${context || 'No previous context.'}

User message:
"${message}"

Rules:
- Be supportive and calm.
- Do not diagnose.
- Do not claim certainty about emotions.
- Keep the response concise.
- Encourage reflection rather than giving extreme advice.
- Return ONLY JSON.

Format:
{
  "reply": "your response"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const parsed = JSON.parse(text);

  return parsed.reply;
};


const generateFinalReflection = async (
  messages = [],
  language = 'en'
) => {
  const languageName = {
    en: 'English',
    hi: 'Hindi',
    gu: 'Gujarati',
  }[language] || 'English';

  const conversationText = messages
    .map(
      (m) =>
        `${m.sender}: ${m.text} | emotion=${m.emotion || 'unknown'}`
    )
    .join('\n');

  const prompt = `
You are Emotion Mirror.

Create a short final reflection for this conversation.

Language: ${languageName}

Conversation:
${conversationText}

Return ONLY JSON:

{
  "summary": "short overall reflection",
  "strongestSignal": "main possible emotional signal",
  "trend": "rising | falling | stable",
  "turningPoints": ["short turning point 1"],
  "suggestion": "optional gentle communication suggestion",
  "note": "AI interpretation — not a fact"
}

Do not diagnose.
Use uncertainty-aware language.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(text);
};


module.exports = {
  analyzeEmotion,
  generateAIReply,
  generateFinalReflection,
};