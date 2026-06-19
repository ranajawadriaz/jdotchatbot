import { Box } from '@mui/material';

// Three bouncing dots shown while we wait for the first streamed token.
export default function TypingIndicator() {
  return (
    <Box className="typing" aria-label="Assistant is typing" role="status">
      <span className="typing__dot" />
      <span className="typing__dot" />
      <span className="typing__dot" />
    </Box>
  );
}
