import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface VerificationResult {
  veracity: 'True' | 'False' | 'Misleading' | 'Unverified' | 'Partially True';
  confidence: number;
  summary: string;
  analysis: string;
  sources: Array<{ title: string; url: string }>;
}

export async function verifyInformation(input: string, locale: string = 'en-US'): Promise<VerificationResult> {
  const model = "gemini-3-flash-preview";
  
  // Map locale to language name for the model
  const languageName = new Intl.DisplayNames(['en'], { type: 'language' }).of(locale.split('-')[0]) || 'English';

  const systemInstruction = `You are an elite, high-speed fact-checker. 
Your task is to provide a lightning-fast yet highly accurate verification of the provided claim or URL.

CRITICAL: You MUST respond in ${languageName}. All fields in the JSON (summary, analysis) must be in ${languageName}.

Respond ONLY in this JSON format:
{
  "veracity": "True" | "False" | "Misleading" | "Unverified" | "Partially True",
  "confidence": number (0-100),
  "summary": "A 1-sentence sharp verdict in ${languageName}.",
  "analysis": "A concise, bulleted breakdown of facts in ${languageName}. Focus on speed and precision. Use markdown.",
  "sources": []
}

Use Google Search to find the most recent and authoritative data. Be decisive.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Verify this: ${input}`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        // Thinking level LOW for faster response as requested
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
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
