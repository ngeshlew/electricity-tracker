import { Router } from 'express';

const router = Router();

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

export default router;


