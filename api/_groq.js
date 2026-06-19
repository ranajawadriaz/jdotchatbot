// Shared Groq helpers used by BOTH the production Edge function (api/chat.js)
// and the local dev middleware (vite.config.js). Files in /api that start with
// "_" are treated as helpers by Vercel, not as routable endpoints.

export const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const MODEL = 'llama-3.3-70b-versatile';

// Fire the streaming chat-completion request to Groq.
export function callGroq(messages, apiKey) {
  return fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: true,
    }),
  });
}

// Async generator that turns Groq's Server-Sent-Events stream into plain
// text deltas. Works in both Edge and Node 18+ (Web Streams + TextDecoder).
export async function* groqTextDeltas(groqResponse) {
  const reader = groqResponse.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const parsed = JSON.parse(data);
        const text = parsed?.choices?.[0]?.delta?.content || '';
        if (text) yield text;
      } catch {
        // keep-alive or partial line — ignore
      }
    }
  }
}
