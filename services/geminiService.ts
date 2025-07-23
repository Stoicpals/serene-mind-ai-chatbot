
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME, SYSTEM_INSTRUCTION } from '../constants';
import { Message } from "../types";

// Ensure API_KEY is available. In a real app, this would be handled securely.
// For local dev with Vite, you might use import.meta.env.VITE_GEMINI_API_KEY
// For this environment, we assume process.env.API_KEY is set.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" });

export const sendMessageToGemini = async (
  messageText: string,
  currentChatHistory: Message[]
): Promise<string> => {
  if (!API_KEY) {
    console.error("Gemini API key is not configured.");
    return "I'm sorry, I'm having trouble connecting right now. Please ensure the API key is configured.";
  }

  try {
    // The history for `ai.chats.create` should not include the current user message being sent.
    // It should be the history *before* the latest user prompt.
    const historyForGemini = currentChatHistory
      .slice(0, -1) // Exclude the last message which is the current user prompt
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
    
    const chat = ai.chats.create({
        model: GEMINI_MODEL_NAME,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: historyForGemini,
    });
    
    const response: GenerateContentResponse = await chat.sendMessage({ message: messageText });
    return response.text;

  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    let errorMessage = "I'm sorry, an unexpected error occurred.";
    if (error instanceof Error) {
        // Basic check for common API key related errors
        if (error.message.includes('API_KEY_INVALID') || error.message.includes('permission') || error.message.includes('API key not valid')) {
            errorMessage = "There seems to be an issue with the API configuration. Please check the API key.";
        } else if (error.message.includes('quota')) {
            errorMessage = "It looks like the request quota has been exceeded. Please try again later.";
        } else if (error.message.includes('400') || error.message.includes('Invalid')) {
             errorMessage = "There was an issue with the request to the AI model. It might be due to an invalid model name or prompt. Please check the configuration.";
        }
    }
    return errorMessage;
  }
};

export const startNewGeminiChat = async (): Promise<GenerateContentResponse> => {
    if (!API_KEY) throw new Error("API Key not configured for Gemini.");
    
    const chat = ai.chats.create({
        model: GEMINI_MODEL_NAME,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
    });
    // Send an initial message to get the AI's greeting
    return chat.sendMessage({ message: "Hello, introduce yourself briefly and ask how I'm feeling." });
};
