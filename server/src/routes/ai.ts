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

// GET /api/ai/health - verifies server can reach AI providers
router.get('/health', async (_req, res) => {
  try {
    const healthStatus = {
      openai: { available: false, modelCount: 0, error: null as string | null },
      ollama: { available: false, modelCount: 0, error: null as string | null }
    };

    // Check OpenAI
    try {
      const apiKey = process.env['OPENAI_API_KEY'];
      if (apiKey) {
        const baseUrl = process.env['OPENAI_BASE_URL'] || 'https://api.openai.com/v1';
        const response = await fetch(`${baseUrl}/models`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        if (response.ok) {
          const json = (await response.json()) as any;
          healthStatus.openai = {
            available: true,
            modelCount: Array.isArray(json?.data) ? json.data.length : 0,
            error: null
          };
        } else {
          healthStatus.openai.error = `HTTP ${response.status}`;
        }
      } else {
        healthStatus.openai.error = 'OPENAI_API_KEY not set';
      }
    } catch (error) {
      healthStatus.openai.error = error instanceof Error ? error.message : String(error);
    }

    // Check Ollama
    try {
      const baseUrl = process.env['OLLAMA_BASE_URL'] || 'http://localhost:11434';
      const response = await fetch(`${baseUrl}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const json = (await response.json()) as any;
        healthStatus.ollama = {
          available: true,
          modelCount: Array.isArray(json?.models) ? json.models.length : 0,
          error: null
        };
      } else {
        healthStatus.ollama.error = `HTTP ${response.status}`;
      }
    } catch (error) {
      healthStatus.ollama.error = error instanceof Error ? error.message : String(error);
    }

    // Determine overall status
    const hasAnyProvider = healthStatus.openai.available || healthStatus.ollama.available;
    const totalModels = healthStatus.openai.modelCount + healthStatus.ollama.modelCount;

    return res.status(hasAnyProvider ? 200 : 502).json({ 
      status: hasAnyProvider ? 'OK' : 'ERROR', 
      modelCount: totalModels,
      providers: healthStatus,
      primaryProvider: process.env['AI_PROVIDER'] || 'openai',
      fallbackProvider: process.env['AI_FALLBACK_PROVIDER'] || 'ollama',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return res.status(500).json({ status: 'ERROR', message: error instanceof Error ? error.message : String(error) });
  }
});

// Helper function to call OpenAI
async function callOpenAI(messages: ChatMessage[], maxTokens: number, temperature: number) {
  const apiKey = process.env['OPENAI_API_KEY'];
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
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
    throw new Error(`OpenAI API failed: ${response.status} - ${text}`);
  }

  const json = (await response.json()) as any;
  return {
    response: json.choices?.[0]?.message?.content || 'No response generated',
    usage: json.usage,
    provider: 'openai'
  };
}

// Helper function to call Ollama
async function callOllama(messages: ChatMessage[], maxTokens: number, temperature: number) {
  const baseUrl = process.env['OLLAMA_BASE_URL'] || 'http://localhost:11434';
  const model = process.env['OLLAMA_MODEL'] || 'llama3.2:3b';
  
  // Convert messages to Ollama format
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');
  
  const prompt = systemMessage 
    ? `${systemMessage.content}\n\n${userMessages.map(m => `${m.role}: ${m.content}`).join('\n')}`
    : userMessages.map(m => `${m.role}: ${m.content}`).join('\n');

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      stream: false,
      options: {
        temperature: temperature,
        num_predict: maxTokens
      }
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama API failed: ${response.status} - ${text}`);
  }

  const json = (await response.json()) as any;
  return {
    response: json.response || 'No response generated',
    usage: { total_tokens: json.prompt_eval_count + json.eval_count },
    provider: 'ollama'
  };
}

// Helper function to call Hugging Face
async function callHuggingFace(messages: ChatMessage[], maxTokens: number, temperature: number) {
  const apiUrl = process.env['HUGGINGFACE_API_URL'] || 'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct';
  const apiKey = process.env['HUGGINGFACE_API_KEY'];
  
  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY is not set');
  }

  // Convert messages to single prompt
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');
  
  const prompt = systemMessage 
    ? `${systemMessage.content}\n\n${userMessages.map(m => `${m.role}: ${m.content}`).join('\n')}`
    : userMessages.map(m => `${m.role}: ${m.content}`).join('\n');

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: maxTokens,
        temperature: temperature,
        return_full_text: false
      }
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Hugging Face API failed: ${response.status} - ${text}`);
  }

  const json = (await response.json()) as any;
  return {
    response: json[0]?.generated_text || 'No response generated',
    usage: { total_tokens: maxTokens }, // HF doesn't provide exact token count
    provider: 'huggingface'
  };
}

// POST /api/ai/chat - proxy chat completions through server with fallback
router.post('/chat', async (req, res) => {
  try {
    const { messages, maxTokens = 1000, temperature = 0.7 }: ChatRequest = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ status: 'ERROR', message: 'Messages array is required' });
    }

    const primaryProvider = process.env['AI_PROVIDER'] || 'openai';
    const fallbackProvider = process.env['AI_FALLBACK_PROVIDER'] || 'ollama';

    let result;
    let usedProvider = primaryProvider;

    try {
      // Try primary provider first
      if (primaryProvider === 'openai') {
        result = await callOpenAI(messages, maxTokens, temperature);
      } else if (primaryProvider === 'ollama') {
        result = await callOllama(messages, maxTokens, temperature);
      } else if (primaryProvider === 'huggingface') {
        result = await callHuggingFace(messages, maxTokens, temperature);
      } else {
        throw new Error(`Unknown primary provider: ${primaryProvider}`);
      }
    } catch (primaryError) {
      console.warn(`Primary provider (${primaryProvider}) failed:`, primaryError);
      
      // Try fallback provider
      try {
        if (fallbackProvider === 'openai') {
          result = await callOpenAI(messages, maxTokens, temperature);
        } else if (fallbackProvider === 'ollama') {
          result = await callOllama(messages, maxTokens, temperature);
        } else if (fallbackProvider === 'huggingface') {
          result = await callHuggingFace(messages, maxTokens, temperature);
        } else {
          throw new Error(`Unknown fallback provider: ${fallbackProvider}`);
        }
        usedProvider = fallbackProvider;
        console.log(`Successfully used fallback provider: ${fallbackProvider}`);
      } catch (fallbackError) {
        console.error(`Both providers failed. Primary: ${primaryError}, Fallback: ${fallbackError}`);
        return res.status(502).json({ 
          status: 'ERROR', 
          message: 'All AI providers failed', 
          code: 502,
          body: `Primary (${primaryProvider}): ${primaryError}. Fallback (${fallbackProvider}): ${fallbackError}`
        });
      }
    }

    return res.status(200).json({ 
      status: 'OK', 
      response: result.response,
      usage: result.usage,
      provider: usedProvider,
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


