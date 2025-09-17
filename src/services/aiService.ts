export interface AIHealthResponse {
  status: 'OK' | 'ERROR';
  modelCount?: number;
  message?: string;
  code?: number;
  body?: string;
  timestamp?: string;
}

const API_BASE = import.meta.env.VITE_SERVER_URL || window.location.origin;

export async function getAIHealth(): Promise<AIHealthResponse> {
  const url = `${API_BASE.replace(/\/$/, '')}/api/ai/health`;
  const res = await fetch(url, { credentials: 'include' });
  const data = (await res.json()) as AIHealthResponse;
  return data;
}


