import { Router } from 'express';

const router = Router();

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
}

// GET /api/ai/health - verifies server can reach OpenAI with OPENAI_API_KEY
router.get('/health', async (_req, res) => {
  try {
    const apiKey = process.env['OPENAI_API_KEY'];
    if (!apiKey) {
      return res.status(500).json({ status: 'ERROR', message: 'OPENAI_API_KEY is not set' });
    }

    const baseUrl = process.env['OPENAI_BASE_URL'] || 'https://api.openai.com/v1';
    const response = await fetch(`${baseUrl}/models`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ status: 'ERROR', message: 'OpenAI check failed', code: response.status, body: text });
    }

    const json = (await response.json()) as any;
    const modelCount = Array.isArray(json?.data) ? json.data.length : 0;
    return res.status(200).json({ status: 'OK', modelCount, timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ status: 'ERROR', message: error instanceof Error ? error.message : String(error) });
  }
});

// POST /api/ai/chat - proxy chat completions through server
router.post('/chat', async (req, res) => {
  try {
    const apiKey = process.env['OPENAI_API_KEY'];
    if (!apiKey) {
      return res.status(500).json({ status: 'ERROR', message: 'OPENAI_API_KEY is not set' });
    }

    const { messages, maxTokens = 1000, temperature = 0.7 }: ChatRequest = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ status: 'ERROR', message: 'Messages array is required' });
    }

    const baseUrl = process.env['OPENAI_BASE_URL'] || 'https://api.openai.com/v1';
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant specialized in electricity consumption analysis and energy efficiency. Help users understand their energy usage patterns and provide actionable recommendations for saving money and reducing consumption.'
          },
          ...messages
        ],
        max_tokens: maxTokens,
        temperature: temperature,
        stream: false
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ 
        status: 'ERROR', 
        message: 'OpenAI chat completion failed', 
        code: response.status, 
        body: text 
      });
    }

    const json = (await response.json()) as any;
    return res.status(200).json({ 
      status: 'OK', 
      response: json.choices?.[0]?.message?.content || 'No response generated',
      usage: json.usage,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 'ERROR', 
      message: error instanceof Error ? error.message : String(error) 
    });
  }
});

export default router;


