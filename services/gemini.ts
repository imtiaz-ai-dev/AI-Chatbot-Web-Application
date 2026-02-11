
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, Role, ModelConfig } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async *sendMessageStream(
    modelName: string,
    history: Message[],
    userInput: string,
    config: ModelConfig
  ) {
    // Format history for Gemini API
    const contents = history.map(msg => ({
      role: msg.role === Role.USER ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add current user input
    contents.push({
      role: 'user',
      parts: [{ text: userInput }]
    });

    const stream = await this.ai.models.generateContentStream({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: config.systemInstruction,
        temperature: config.temperature,
        topP: config.topP,
        topK: config.topK,
        maxOutputTokens: config.maxOutputTokens,
      }
    });

    for await (const chunk of stream) {
      yield chunk.text || "";
    }
  }
}

export const geminiService = new GeminiService();
