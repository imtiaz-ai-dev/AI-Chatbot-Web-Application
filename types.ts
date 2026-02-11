
export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export type ViewType = 'workspace' | 'vault' | 'analytics';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  modelId: string;
  createdAt: Date;
}

export interface ModelConfig {
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens?: number;
  systemInstruction?: string;
}

export interface APIKeyState {
  openai: string;
  groq: string;
  gemini: string; // System managed
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: 'Gemini' | 'OpenAI' | 'Groq';
}
