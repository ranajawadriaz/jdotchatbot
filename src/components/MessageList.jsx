import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import Message from './Message';
import EmptyState from './EmptyState';

export default function MessageList({ messages, isStreaming, isDark, onPick }) {
  const bottomRef = useRef(null);
  const isEmpty = messages.length === 0;

  // Keep the latest message in view as content streams in.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isStreaming]);

  return (
    <Box className="message-list" component="main">
      <Box className="message-list__inner">
        {isEmpty ? (
          <EmptyState isDark={isDark} onPick={onPick} />
        ) : (
          messages.map((m, i) => {
            const isLast = i === messages.length - 1;
            const showTyping =
              isLast && m.role === 'assistant' && isStreaming && !m.content;
            return (
              <Message key={m.id} message={m} isDark={isDark} showTyping={showTyping} />
            );
          })
        )}
        <div ref={bottomRef} />
      </Box>
    </Box>
  );
}
