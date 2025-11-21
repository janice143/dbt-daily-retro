import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysis, ReflectionInput, Language } from "../types";

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    essence: {
      type: Type.STRING,
      description: "A deep analysis of the root cause of the problem based on the 'Bad' and 'Thinking' inputs.",
    },
    key_insight: {
      type: Type.STRING,
      description: "A one-sentence profound insight or 'aha moment' regarding their situation.",
    },
    actionable_steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-4 concrete, specific, and actionable steps the user can take to improve.",
    },
    encouragement: {
      type: Type.STRING,
      description: "A short, wise, and empathetic closing statement or motto.",
    },
  },
  required: ["essence", "key_insight", "actionable_steps", "encouragement"],
};

export const analyzeReflection = async (input: ReflectionInput, language: Language): Promise<AIAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const languageInstruction = language === 'zh' 
    ? "IMPORTANT: Output the JSON response values strictly in Simplified Chinese (zh-CN)." 
    : "IMPORTANT: Output the JSON response values in English.";

  const prompt = `
    You are a world-class Life Coach and Mentor. You are wise, empathetic, but sharp and direct when identifying problems.
    
    The user is performing a daily reflection using the "Did / Bad / Thinking" framework:
    - **Did**: What they completed today.
    - **Bad**: What they felt they didn't do well or needs improvement (Focus here for problems).
    - **Thinking**: Random thoughts, context, or mental noise (Use this for root cause analysis).

    Your Task:
    1. Read the following inputs carefully.
    2. Analyze the **essence** of the problem. Don't just repeat what they did wrong; explain *why* it happened based on their thinking patterns or behaviors.
    3. Provide concrete **actionable steps** to fix this or improve tomorrow.
    4. Be concise, professional, yet warm.
    5. ${languageInstruction}

    User's Reflection:
    ---
    DID: ${input.did}
    BAD: ${input.bad}
    THINKING: ${input.thinking}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are an expert mentor focusing on productivity, psychology, and personal growth.",
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AIAnalysis;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};