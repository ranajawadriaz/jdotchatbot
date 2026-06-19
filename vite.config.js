import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { callGroq, groqTextDeltas } from './api/_groq.js'

// Dev-only plugin: makes `npm run dev` serve POST /api/chat locally, mirroring
// the Vercel Edge function so you can test the chat without `vercel dev`.
// The key is read server-side from .env.local and never reaches the browser.
function devGroqApi(apiKey) {
  return {
    name: 'dev-groq-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('Method not allowed')
        }
        if (!apiKey) {
          res.statusCode = 500
          return res.end(
            JSON.stringify({ error: 'Missing GROQ_API_KEY. Add it to .env.local for local dev.' }),
          )
        }
        try {
          let raw = ''
          for await (const chunk of req) raw += chunk
          const { messages } = JSON.parse(raw || '{}')
          if (!Array.isArray(messages) || messages.length === 0) {
            res.statusCode = 400
            return res.end(JSON.stringify({ error: 'Missing "messages" array.' }))
          }

          const groqRes = await callGroq(messages, apiKey)
          if (!groqRes.ok || !groqRes.body) {
            const detail = await groqRes.text().catch(() => '')
            res.statusCode = groqRes.status || 502
            return res.end(JSON.stringify({ error: `Groq API error (${groqRes.status}). ${detail}` }))
          }

          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.setHeader('Cache-Control', 'no-cache')
          for await (const delta of groqTextDeltas(groqRes)) res.write(delta)
          res.end()
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: err?.message || 'Local proxy error.' }))
        }
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load every env var (prefix '') so we can read the unprefixed GROQ_API_KEY
  // for the dev middleware. It stays server-side — only VITE_* vars are exposed.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), devGroqApi(env.GROQ_API_KEY)],
    build: {
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          // Split heavy vendors into their own cacheable chunks so they load in
          // parallel and don't bust cache when app code changes.
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
            markdown: ['react-markdown', 'react-syntax-highlighter'],
          },
        },
      },
    },
  }
})
