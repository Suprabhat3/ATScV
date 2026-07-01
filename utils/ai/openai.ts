import OpenAI from 'openai';

// Requires OPENAI_API_KEY in your .env.local (a real OpenAI API key).
export const aiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const AI_MODEL = 'gpt-5.4-mini';
