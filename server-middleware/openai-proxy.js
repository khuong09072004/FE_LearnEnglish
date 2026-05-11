const axios = require('axios');

// Minimal server middleware without external dependencies.
// Exposes POST /api/openai/chat

module.exports = function (req, res, next) {
  // Only handle our API path
  if (req.url !== '/chat' || req.method !== 'POST') return next();

  let raw = '';
  req.on('data', (chunk) => {
    raw += chunk;
    // protect against large bodies
    if (raw.length > 1e6) {
      res.statusCode = 413;
      return res.end('Payload too large');
    }
  });

  req.on('end', async () => {
    try {
      const body = raw ? JSON.parse(raw) : {};
      const userMessage = body.message || body.prompt || '';

      if (!userMessage) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'Missing message in request body' }));
      }

      const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.NUXT_OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'OpenAI API key not configured on server' }));
      }

      // Build request for OpenAI Chat Completions
      const defaultModel = process.env.OPENAI_DEFAULT_MODEL || 'gpt-3.5-turbo';

      // Strict system prompt for English-learning assistant
      const defaultSystem =
        process.env.OPENAI_DEFAULT_SYSTEM ||
        `You are an assistant dedicated solely to helping the user learn English. Only provide explanations, corrections, examples, exercises, feedback, and practice related to English language learning (grammar, vocabulary, pronunciation, usage, writing, reading, listening, conversation). Do NOT provide medical, legal, political, or general technical advice or any content outside the scope of English learning. If the user asks about unrelated subjects or persists in off-topic requests, politely refuse with: "Xin lỗi, tôi chỉ hỗ trợ học tiếng Anh." Respond in Vietnamese if the user's message is in Vietnamese; otherwise respond in English. Keep answers focused, concise, and educational.`;

      const payload = {
        model: body.model || defaultModel,
        messages: [
          { role: 'system', content: body.system || defaultSystem },
          { role: 'user', content: userMessage },
        ],
        temperature: typeof body.temperature === 'number' ? body.temperature : 0.7,
        max_tokens: typeof body.max_tokens === 'number' ? body.max_tokens : 600,
      };

      const resp = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      });

      const choice = resp.data && resp.data.choices && resp.data.choices[0];
      const replyText = choice && choice.message && choice.message.content ? choice.message.content : '';

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, reply: replyText, raw: resp.data }));
    } catch (error) {
      console.error('OpenAI proxy error:', error && error.message ? error.message : error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      const message = error && error.response && error.response.data ? error.response.data : { message: error.message || 'Unknown' };
      res.end(JSON.stringify({ error: 'OpenAI request failed', details: message }));
    }
  });
};
