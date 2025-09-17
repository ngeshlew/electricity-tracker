export interface AIHealthResponse {
  status: 'OK' | 'ERROR';
  modelCount?: number;
  message?: string;
  code?: number;
  body?: string;
  timestamp?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface ChatResponse {
  status: 'OK' | 'ERROR';
  response?: string;
  usage?: any;
  message?: string;
  timestamp?: string;
}

const API_BASE = import.meta.env.VITE_SERVER_URL || window.location.origin;

export async function getAIHealth(): Promise<AIHealthResponse> {
  const url = `${API_BASE.replace(/\/$/, '')}/api/ai/health`;
  const res = await fetch(url, { credentials: 'include' });
  const data = (await res.json()) as AIHealthResponse;
  return data;
}

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const url = `${API_BASE.replace(/\/$/, '')}/api/ai/chat`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(request),
  });
  const data = (await res.json()) as ChatResponse;
  return data;
}


