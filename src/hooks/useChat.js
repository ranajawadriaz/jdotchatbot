import { useCallback, useEffect, useRef, useState } from 'react';
import { SYSTEM_PROMPT } from '../config';

const STORAGE_KEY = 'jchatbot.history.v2';

// Messages are stored flat as { id, role: 'user' | 'assistant', content }.
// History survives in sessionStorage so it persists for the browsing session
// (and across accidental reloads in the same tab) but is gone when the tab closes.
function loadHistory() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

const newId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

export function useChat() {
  const [messages, setMessages] = useState(loadHistory);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // Persist on every change.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* storage full / unavailable — non-fatal */
    }
  }, [messages]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      const content = text.trim();
      if (!content || isStreaming) return;

      setError(null);
      const userMsg = { id: newId(), role: 'user', content };
      const assistantId = newId();

      // Build the payload BEFORE we mutate state (system prompt + full history + new turn).
      const payload = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(({ role, content }) => ({ role, content })),
        { role: 'user', content },
      ];

      // Optimistically render the user message + an empty assistant bubble.
      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: assistantId, role: 'assistant', content: '' },
      ]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: payload }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          let message = `Request failed (${res.status}).`;
          try {
            const data = await res.json();
            if (data?.error) message = data.error;
          } catch {
            /* response was not JSON */
          }
          throw new Error(message);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
          );
        }

        // If the stream produced nothing, surface a gentle fallback.
        if (!acc.trim()) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: "I didn't catch that — could you rephrase?" }
                : m,
            ),
          );
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          // User stopped generation: keep whatever streamed so far, drop empty bubbles.
          setMessages((prev) =>
            prev.filter((m) => !(m.id === assistantId && !m.content.trim())),
          );
        } else {
          const msg =
            err.message ||
            'Something went wrong reaching the assistant. Please try again.';
          setError(msg);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: `⚠️ ${msg}`, isError: true }
                : m,
            ),
          );
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, isStreaming],
  );

  return { messages, isStreaming, error, sendMessage, stop, clear };
}
