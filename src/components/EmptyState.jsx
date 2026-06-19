import { Avatar, Box, Chip, Typography, Grow } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { BOT_NAME, SUGGESTED_PROMPTS } from '../config';
import { brandGradient } from '../theme';

export default function EmptyState({ isDark, onPick }) {
  return (
    <Box className="empty">
      <Grow in timeout={500}>
        <Avatar
          sx={{
            background: brandGradient(isDark),
            color: '#fff',
            width: 76,
            height: 76,
            mb: 2,
            boxShadow: 4,
          }}
          className="empty__avatar"
        >
          <AutoAwesomeRoundedIcon sx={{ fontSize: 38 }} />
        </Avatar>
      </Grow>

      <Typography variant="h5" fontWeight={800} gutterBottom>
        Hey, I&apos;m {BOT_NAME} 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 460, mb: 3 }}>
        Ask me anything. I remember our conversation while this tab stays open, so we can
        pick up right where we left off.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'center',
          maxWidth: 600,
          width: '100%',
        }}
      >
        {SUGGESTED_PROMPTS.map((prompt) => (
          <Chip
            key={prompt}
            label={prompt}
            onClick={() => onPick(prompt.replace(/^\S+\s/, ''))}
            variant="outlined"
            className="empty__chip"
            clickable
            sx={{ maxWidth: '100%', height: 'auto', py: 0.75 }}
          />
        ))}
      </Box>
    </Box>
  );
}
