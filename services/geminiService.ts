import { GoogleGenAI, Type, Schema } from "@google/genai";

// Use the provided API key from environment
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateElementContent = async (type: string, userPrompt: string): Promise<any> => {
  const modelId = "gemini-2.5-flash";

  const systemInstruction = `
    You are a professional web designer assistant.
    Your task is to generate content and styles for a website section based on the user's request.
    The output must be strict JSON adhering to the schema provided.
    Use modern, professional copywriting and pleasing color palettes (Tailwind classes or hex codes).
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      content: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          body: { type: Type.STRING },
          buttonText: { type: Type.STRING },
          items: {
             type: Type.ARRAY,
             items: {
               type: Type.OBJECT,
               properties: {
                 title: { type: Type.STRING },
                 description: { type: Type.STRING },
                 icon: { type: Type.STRING } // Just a placeholder name for now
               }
             }
          }
        },
        required: ["title"]
      },
      styles: {
        type: Type.OBJECT,
        properties: {
          backgroundColor: { type: Type.STRING },
          color: { type: Type.STRING },
          padding: { type: Type.STRING },
          textAlign: { type: Type.STRING, enum: ["left", "center", "right"] }
        }
      }
    },
    required: ["content", "styles"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Generate a ${type} section. Context: ${userPrompt}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);

  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
};

export const improveText = async (currentText: string, instructions: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Rewrite the following website text based on these instructions: "${instructions}".
      Original Text: "${currentText}"
      
      Return ONLY the rewritten text, no quotes or explanations.`,
    });
    return response.text?.trim() || currentText;
  } catch (error) {
    console.error("Error improving text:", error);
    return currentText;
  }
};