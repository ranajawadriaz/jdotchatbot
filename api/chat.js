// Vercel Edge Function — secure proxy to the Groq API.
//
// WHY THIS EXISTS:
// A pure frontend app cannot hold a secret. Anything shipped to the browser
// (including Vite `VITE_*` env vars) ends up in the public JS bundle and can be
// read by anyone. So we never expose the Groq key to the client. Instead the
// browser calls THIS function (same origin: /api/chat), and the function — which
// runs on Vercel's servers — adds the secret key and forwards the request to Groq.
//
// The key lives only in a Vercel Environment Variable named GROQ_API_KEY
// (NO "VITE_" prefix, so it is never bundled into the frontend).
//
// It streams Groq's response back token-by-token for a fast, "typing" UX.

import { callGroq, groqTextDeltas } from './_groq.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return json(
      { error: 'Server is missing GROQ_API_KEY. Add it in Vercel → Settings → Environment Variables.' },
      500,
    );
  }

  let messages;
  try {
    const body = await req.json();
    messages = body?.messages;
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return json({ error: 'Request must include a non-empty "messages" array.' }, 400);
  }

  let groqRes;
  try {
    groqRes = await callGroq(messages, apiKey);
  } catch {
    return json({ error: 'Could not reach the Groq API. Please try again.' }, 502);
  }

  if (!groqRes.ok || !groqRes.body) {
    const detail = await groqRes.text().catch(() => '');
    return json(
      { error: `Groq API error (${groqRes.status}). ${safeTrim(detail)}` },
      groqRes.status || 502,
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const delta of groqTextDeltas(groqRes)) {
          controller.enqueue(encoder.encode(delta));
        }
      } catch {
        // Stream interrupted — close gracefully so the client stops waiting.
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function safeTrim(text) {
  if (!text) return '';
  return text.length > 300 ? `${text.slice(0, 300)}…` : text;
}
