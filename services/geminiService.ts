
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysis, ReflectionInput, Language } from "../types";

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    bad_modules: {
      type: Type.ARRAY,
      description: "An array of analysis modules. You MUST create one separate module for EACH item listed in the user's BAD section.",
      items: {
        type: Type.OBJECT,
        properties: {
          related_item_title: {
            type: Type.STRING,
            description: "The exact title of the user's Bad item that this module is analyzing.",
          },
          theory: {
            type: Type.STRING,
            description: "The specific scientific theory or behavioral concept explaining this behavior (e.g., 'Dopamine Feedback Loop', 'Decision Fatigue', 'Ego Depletion', 'Hyperbolic Discounting').",
          },
          explanation: {
            type: Type.STRING,
            description: "Deep dive explanation of why this behavior happened based on the theory. Be analytical, not descriptive.",
          },
          actions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 specific, immediate actionable steps to correct this behavior.",
          },
        },
        required: ["related_item_title", "theory", "explanation", "actions"],
      },
    },
    thinking_modules: {
      type: Type.ARRAY,
      description: "An array of analysis modules. You MUST create one separate module for EACH item listed in the user's THINKING section.",
      items: {
        type: Type.OBJECT,
        properties: {
          related_item_title: {
            type: Type.STRING,
            description: "The exact title of the user's Thinking item that this module is analyzing.",
          },
          theory: {
            type: Type.STRING,
            description: "The specific cognitive psychology concept or mental model (e.g., 'Imposter Syndrome', 'Spotlight Effect', 'Fixed Mindset', 'Cognitive Dissonance').",
          },
          explanation: {
            type: Type.STRING,
            description: "Deep dive explanation of the mental blocker. Why is the user thinking this way?",
          },
          actions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 specific cognitive reframing exercises or thinking tools.",
          },
        },
        required: ["related_item_title", "theory", "explanation", "actions"],
      },
    },
    encouragement: {
      type: Type.STRING,
      description: "A final, brief reality-check or grounding statement.",
    },
  },
  required: ["bad_modules", "thinking_modules", "encouragement"],
};

export const analyzeReflection = async (input: ReflectionInput, language: Language): Promise<AIAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Format arrays for prompt
  const didText = input.did.filter(i => i.trim()).map(i => `- ${i}`).join('\n');
  
  // Format Complex Objects into readable text
  const badText = input.bad
    .filter(i => i.title.trim())
    .map((i, idx) => `Item ${idx + 1} Title: ${i.title}\n   Item ${idx + 1} Details: ${i.description || 'No details'}`)
    .join('\n\n');

  const thinkingText = input.thinking
    .filter(i => i.title.trim())
    .map((i, idx) => `Item ${idx + 1} Title: ${i.title}\n   Item ${idx + 1} Details: ${i.description || 'No details'}`)
    .join('\n\n');

  const prompt = `
    You are an expert Behavioral Scientist and Strategy Consultant.
    
    **TASK:**
    Analyze the user's daily reflection. The user provides three sections: DID, BAD, and THINKING.
    
    **ANALYSIS RULES:**
    1. **DID Section:** This is context only. Do NOT analyze it. Use it to understand the user's day.
    2. **BAD Section (Behavioral Analysis):** 
       - For EACH item listed in the BAD section, provide a separate analysis module.
       - Focus strictly on what went wrong in their actions/habits.
       - Identify the **Root Cause** using a specific **Scientific Theory** or **Psychological Concept**.
       - Do NOT give literary advice. Give scientific explanations.
    3. **THINKING Section (Cognitive Analysis):**
       - For EACH item listed in the THINKING section, provide a separate analysis module.
       - Focus strictly on their internal monologue, doubts, or confusion.
       - Identify the **Cognitive Bias** or **Mental Model** failure.
       - Do NOT mix this with the Bad section. Treat it as a separate cognitive problem.

    **OUTPUT RULES:**
    - **Language:** IF User Input is Chinese -> Output Simplified Chinese. IF English -> Output English.
    - **Tone:** Objective, Analytical, Clinical. No fluff. No "It's okay to feel this way."
    - **Theories:** specific terms are required (e.g., "Zeigarnik Effect", "Pareto Principle", "Dunning-Kruger Effect").
    - **Structure:** The output JSON must contain arrays 'bad_modules' and 'thinking_modules', with one entry for each valid input item.

    User's Reflection:
    ---
    [DID - Context (Do Not Analyze)]
    ${didText || "No entry"}

    [BAD - Analyze Behaviors (Create one analysis per item)]
    ${badText || "No entry"}

    [THINKING - Analyze Cognition (Create one analysis per item)]
    ${thinkingText || "No entry"}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.3, 
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
