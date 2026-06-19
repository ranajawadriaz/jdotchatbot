# J. ChatBot

A modern, responsive AI chat app built with **React + Vite** and **Material UI**,
powered by **Llama 3.3 70B on Groq** (fast streaming responses). The Groq API key
is kept secret behind a serverless function, so it never ships to the browser.

## ✨ Highlights

- ⚡ **Streaming responses** — replies appear token-by-token (like ChatGPT)
- 🔒 **Secret-safe** — the API key lives only on the server (Vercel function), never in the bundle
- 🎨 **Material UI** with light/dark themes (follows your OS preference on first visit)
- 📱 **App-style layout** — the page never scrolls; only the message list does. Fully responsive
- 🧠 **Session memory** — remembers the conversation while the tab is open
- 💬 **WhatsApp button** — floating button that opens a chat with you, with a prefilled message
- ✍️ Markdown + syntax-highlighted code blocks with one-click copy

## 🏗️ How the API key stays secret

A frontend-only app **cannot** hold a secret — anything in the browser bundle
(including Vite `VITE_*` variables) is public. So the flow is:

```
Browser  ──POST /api/chat──►  Edge Function (api/chat.js)  ──+ secret key──►  Groq API
   ▲                              (runs on Vercel's servers)                      │
   └───────────────────  streamed text response  ◄──────────────────────────────┘
```

The key is read from `process.env.GROQ_API_KEY` **on the server only**.

## 🚀 Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` (copy from `.env.example`) and add your key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```
   > Note: it's `GROQ_API_KEY`, **not** `VITE_GROQ_API_KEY`. The `VITE_` prefix would
   > leak it into the public frontend bundle.
3. Run the dev server:
   ```bash
   npm run dev
   ```
   A built-in dev middleware serves `/api/chat` locally using your `.env.local` key,
   so the chat works without `vercel dev`. (`vercel dev` also works if you prefer it.)

Get a free key at <https://console.groq.com/keys>.

## ☁️ Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel (framework preset: **Vite** — auto-detected).
2. In **Project → Settings → Environment Variables**, add:
   | Name | Value | Environments |
   | --- | --- | --- |
   | `GROQ_API_KEY` | your Groq key | Production, Preview, Development |
3. Deploy. Vercel automatically turns `api/chat.js` into a serverless Edge function at `/api/chat`.

That's it — no extra config needed. The frontend and the function deploy together.

## ⚙️ Personalize it (`src/config.js`)

Open [`src/config.js`](src/config.js) and set:

- `WHATSAPP_NUMBER` — **your** number in international format, digits only (e.g. `923001234567`)
- `WHATSAPP_PREFILLED_MESSAGE` — the message visitors send you
- `BOT_NAME`, `BOT_TAGLINE`, `SYSTEM_PROMPT`, `SUGGESTED_PROMPTS`

## 🧱 Project structure

```
api/
  chat.js            Vercel Edge function — secure Groq proxy (streaming)
  _groq.js           Shared Groq helpers (used by the function AND dev middleware)
src/
  App.jsx            App shell: theme provider + fixed full-viewport layout
  theme.js           MUI light/dark theme factory
  config.js          ← edit me (WhatsApp number, bot identity, prompts)
  hooks/useChat.js   Chat state, streaming, sessionStorage history
  components/        Header, MessageList, Message, ChatInput, EmptyState,
                     MarkdownRenderer, TypingIndicator, WhatsAppFab
vite.config.js       Build chunking + local /api/chat dev middleware
```

## 🛠️ Built with

- React 18 · Vite 5
- Material UI (`@mui/material`, `@mui/icons-material`) + Emotion
- `react-markdown` + `react-syntax-highlighter`
- Groq API (`llama-3.3-70b-versatile`)

## 🔒 Privacy

- No database; conversation lives in your browser's `sessionStorage` for the tab session.
- The API key never reaches the browser — it's only used server-side.
