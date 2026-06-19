// ─────────────────────────────────────────────────────────────────────────────
//  EDIT ME: App personalization lives here.
// ─────────────────────────────────────────────────────────────────────────────

// 👉 REQUIRED: Put YOUR WhatsApp number here in full international format,
//    digits only — no "+", no spaces, no dashes.
//    Example for Pakistan (+92 300 1234567)  ->  '923001234567'
//    Example for USA      (+1 415 5550123)   ->  '14155550123'
export const WHATSAPP_NUMBER = '923011119707'; // +92 301 1119707

// Pre-filled message the visitor sends you from the chatbot site.
export const WHATSAPP_PREFILLED_MESSAGE =
  "Hi! 👋 I came from your J. ChatBot website and I'd like to chat.";

// Bot identity / branding.
export const BOT_NAME = 'J. ChatBot';
export const BOT_TAGLINE = 'Your friendly AI assistant';

// Friendly model name shown in the "Powered by" line (display only).
export const MODEL_LABEL = 'Llama 3.3 70B';

// System prompt that shapes the assistant's personality and memory behaviour.
export const SYSTEM_PROMPT =
  `You are ${BOT_NAME}, a helpful, friendly and concise AI assistant. ` +
  'Remember details the user shares within this conversation and use them to give ' +
  'personalized, context-aware answers. Format responses in clean Markdown when it ' +
  'improves readability (lists, code blocks, tables), but keep replies natural and to the point.';

// Starter prompts shown on the empty welcome screen. Click = instant send.
export const SUGGESTED_PROMPTS = [
  '💡 Give me a creative idea for a weekend project',
  '🧠 Explain a complex topic in simple terms',
  '✍️ Help me write a professional email',
  '🐛 Debug a piece of code with me',
];

// Builds the WhatsApp "click to chat" deep link.
export const buildWhatsAppUrl = () =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_PREFILLED_MESSAGE)}`;
