import { useRef, useState } from 'react';
import { Box, IconButton, Paper, Tooltip } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { MODEL_LABEL } from '../config';

const MAX_TEXTAREA_HEIGHT = 160; // px — caps growth, then scrolls internally.

export default function ChatInput({ onSend, onStop, isStreaming }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const autoGrow = (el) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    autoGrow(e.target);
  };

  const submit = () => {
    const text = value.trim();
    if (!text || isStreaming) return;
    onSend(text);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    // Enter sends; Shift+Enter makes a new line.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <Box className="composer" component="footer">
      <Paper elevation={0} className="composer__surface">
        <textarea
          ref={textareaRef}
          className="composer__textarea"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything…"
          rows={1}
          aria-label="Message"
        />

        {isStreaming ? (
          <Tooltip title="Stop generating">
            <IconButton
              className="composer__send composer__send--stop"
              onClick={onStop}
              aria-label="Stop generating"
            >
              <StopRoundedIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Send (Enter)">
            <span>
              <IconButton
                className="composer__send"
                onClick={submit}
                disabled={!value.trim()}
                aria-label="Send message"
              >
                <SendRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Paper>
      <p className="composer__hint">
        Press <kbd>Enter</kbd> to send · <kbd>Shift</kbd>+<kbd>Enter</kbd> for a new line
      </p>
      <p className="composer__powered">
        <BoltRoundedIcon sx={{ fontSize: 13 }} />
        Powered by {MODEL_LABEL}
      </p>
    </Box>
  );
}
