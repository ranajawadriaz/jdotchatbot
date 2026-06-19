import { Avatar, Box, Fade } from '@mui/material';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MarkdownRenderer from './MarkdownRenderer';
import TypingIndicator from './TypingIndicator';
import { brandGradient } from '../theme';

export default function Message({ message, isDark, showTyping }) {
  const isUser = message.role === 'user';

  return (
    <Fade in timeout={350}>
      <Box className={`msg ${isUser ? 'msg--user' : 'msg--bot'}`}>
        {!isUser && (
          <Avatar
            className="msg__avatar"
            sx={{ background: brandGradient(isDark), color: '#fff' }}
          >
            <SmartToyRoundedIcon fontSize="small" />
          </Avatar>
        )}

        <Box
          className={`msg__bubble ${isUser ? 'msg__bubble--user' : 'msg__bubble--bot'} ${
            message.isError ? 'msg__bubble--error' : ''
          }`}
        >
          {showTyping ? (
            <TypingIndicator />
          ) : isUser ? (
            <span className="msg__text">{message.content}</span>
          ) : (
            <MarkdownRenderer content={message.content} isDark={isDark} />
          )}
        </Box>

        {isUser && (
          <Avatar className="msg__avatar msg__avatar--user">
            <PersonRoundedIcon fontSize="small" />
          </Avatar>
        )}
      </Box>
    </Fade>
  );
}
