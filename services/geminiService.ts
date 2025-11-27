import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCosmicPrompt = async (): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a short, abstract, poetic, and cosmic art prompt for a generative painting app. It should be 10-15 words max. Example: 'The sound of a nebula weeping stardust.'",
    });
    
    return response.text || "The void whispers back.";
  } catch (error) {
    console.error("Cosmic Muse Error:", error);
    return "The stars are silent right now. (Check API Key)";
  }
};
