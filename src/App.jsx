import { useEffect, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Snackbar, Alert } from '@mui/material';
import { createAppTheme } from './theme';
import { useChat } from './hooks/useChat';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import './App.css';

export default function App() {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('jchatbot.theme');
    if (saved === 'light' || saved === 'dark') return saved;
    // Default to light on first visit (a returning user's toggle is remembered).
    return 'light';
  });

  const isDark = mode === 'dark';
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => {
    localStorage.setItem('jchatbot.theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  const { messages, isStreaming, error, sendMessage, stop, clear } = useChat();
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (error) setToastOpen(true);
  }, [error]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-shell">
        <ChatHeader
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onClear={clear}
          canClear={messages.length > 0 && !isStreaming}
        />

        <MessageList
          messages={messages}
          isStreaming={isStreaming}
          isDark={isDark}
          onPick={sendMessage}
        />

        <ChatInput onSend={sendMessage} onStop={stop} isStreaming={isStreaming} />
      </Box>

      <Snackbar
        open={toastOpen}
        autoHideDuration={5000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setToastOpen(false)}
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
