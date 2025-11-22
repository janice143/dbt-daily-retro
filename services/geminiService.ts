
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysis, ReflectionInput, Language } from "../types";

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    bad_modules: {
      type: Type.ARRAY,
      description: "Analysis modules for BAD section items.",
      items: {
        type: Type.OBJECT,
        properties: {
          related_item_id: { type: Type.STRING, description: "The ID of the input item this analysis belongs to." },
          essence: {
            type: Type.STRING,
            description: "1. The Essence: What is the core nature of this problem? Dig deep but explain it simply. (e.g., 'It's not laziness, it's fear of imperfection').",
          },
          true_goal: {
            type: Type.STRING,
            description: "2. True Goal: What is the user subconsciously trying to achieve? (e.g., 'You are seeking mental rest, not entertainment').",
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3. AI Suggestions: Provide exactly 3 distinct, actionable, and friendly suggestions.",
          },
        },
        required: ["related_item_id", "essence", "true_goal", "suggestions"],
      },
    },
    thinking_modules: {
      type: Type.ARRAY,
      description: "Analysis modules for THINKING section items.",
      items: {
        type: Type.OBJECT,
        properties: {
          related_item_id: { type: Type.STRING, description: "The ID of the input item this analysis belongs to." },
          essence: {
            type: Type.STRING,
            description: "1. The Essence: What is the core nature of this thought? Dig deep but explain it simply.",
          },
          true_goal: {
            type: Type.STRING,
            description: "2. True Goal: What is the user subconsciously trying to achieve?",
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3. AI Suggestions: Provide exactly 3 distinct, actionable, and friendly suggestions.",
          },
        },
        required: ["related_item_id", "essence", "true_goal", "suggestions"],
      },
    },
    encouragement: {
      type: Type.STRING,
      description: "A warm, encouraging closing statement.",
    },
  },
  required: ["bad_modules", "thinking_modules", "encouragement"],
};

export const analyzeReflection = async (input: ReflectionInput, language: Language): Promise<AIAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Format arrays for prompt with IDs
  const didText = input.did.filter(i => i.trim()).map(i => `- ${i}`).join('\n');
  
  const badText = input.bad
    .filter(i => i.title.trim())
    .map((i) => `ID: ${i.id}\nTitle: ${i.title}\nDescription: ${i.description || 'No details'}`)
    .join('\n\n');

  const thinkingText = input.thinking
    .filter(i => i.title.trim())
    .map((i) => `ID: ${i.id}\nTitle: ${i.title}\nDescription: ${i.description || 'No details'}`)
    .join('\n\n');

  const prompt = `
    You are a friendly, wise, and direct Personal Mentor. 
    Your job is to analyze the user's daily reflection and provide clarity.
    
    **TONE:**
    - Direct and Honest (don't sugarcoat, but don't be harsh).
    - Friendly and Warm (like a trusted older sibling or friend).
    - Easy to understand (avoid academic jargon, use clear metaphors).
    - Profound (don't just scratch the surface, tell them the truth).
    
    **LANGUAGE:**
    - If the user input is Chinese, output CHINESE.
    - If English, output ENGLISH.

    **ANALYSIS STRUCTURE (For each item):**
    
    1. **The Essence (问题的本质):**
       - Look behind the behavior. If they scrolled TikTok, maybe they are exhausted, not lazy.
       - Explain *why* this is happening in one clear sentence.
       
    2. **True Goal (用户的真实目标):**
       - What needs are they trying to meet? (Safety, Rest, Validation, Control?)
       - Reframe their struggle as a misaligned attempt to meet a valid need.
       
    3. **3 Suggestions (AI建议):**
       - Give exactly 3 suggestions.
       - They should be concrete and actionable.
       - Mix of mindset shifts and physical actions.

    **INPUT DATA:**
    ---
    [DID - Context]
    ${didText || "No entry"}

    [BAD - Analyze These]
    ${badText || "No entry"}

    [THINKING - Analyze These]
    ${thinkingText || "No entry"}
    ---
    
    IMPORTANT: Return the 'related_item_id' exactly as provided in the input.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.75, 
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
