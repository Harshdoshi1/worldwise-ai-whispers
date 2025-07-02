// Gemini API integration for Node.js backend
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function geminiChat(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    return response.text;
  } catch (err) {
    throw new Error('Gemini API error: ' + (err?.message || err));
  }
}

export async function geminiExtractKeyword(userMessage) {
  const keywordPrompt = `Extract a single keyword (place, food, or theme) from this user query for image search. Only return the keyword.\nQuery: ${userMessage}`;
  try {
    const result = await geminiChat(keywordPrompt);
    return result.trim().replace(/^\["']|["']$/g, "");
  } catch (err) {
    throw new Error('Gemini keyword extraction error: ' + (err?.message || err));
  }
}
