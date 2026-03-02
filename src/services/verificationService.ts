import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface VerificationResult {
  veracity: 'True' | 'False' | 'Misleading' | 'Unverified' | 'Partially True';
  confidence: number;
  summary: string;
  analysis: string;
  sources: Array<{ title: string; url: string }>;
}

export async function verifyInformation(input: string): Promise<VerificationResult> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are a professional fact-checker for a high-end news verification service. 
Your goal is to analyze the provided information or news article and determine its veracity based on the most current and credible information available via Google Search.

CRITICAL: You MUST respond in the SAME LANGUAGE as the user's input query. For example, if the user asks in Vietnamese, your entire JSON response (except for the keys and the veracity enum values) must be in Vietnamese.

Respond ONLY in the following JSON format:
{
  "veracity": "True" | "False" | "Misleading" | "Unverified" | "Partially True",
  "confidence": number (0-100),
  "summary": "A concise 1-2 sentence summary of the verdict in the user's language.",
  "analysis": "A detailed breakdown of the facts in the user's language. Use markdown for formatting.",
  "sources": []
}

Be objective, neutral, and thorough. If the input is a URL, visit it (if possible) or search for its content. If it's text, verify the claims within it.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Verify this: ${input}`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    // Extract sources from grounding metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks?.map(chunk => ({
      title: chunk.web?.title || "Source",
      url: chunk.web?.uri || ""
    })).filter(s => s.url) || [];

    return {
      ...result,
      sources: sources.slice(0, 5) // Limit to top 5 sources
    };
  } catch (error) {
    console.error("Verification error:", error);
    throw new Error("Failed to verify information. Please try again.");
  }
}
