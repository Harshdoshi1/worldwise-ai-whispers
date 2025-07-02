import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-pro',
      contents: 'Hello, world!'
    });
    console.log('Gemini response:', response.text);
  } catch (err) {
    console.error('Gemini API error:', err);
  }
}

test();
