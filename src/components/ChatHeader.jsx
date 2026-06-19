import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { BOT_NAME, BOT_TAGLINE, buildWhatsAppUrl } from '../config';
import { brandGradient } from '../theme';

export default function ChatHeader({ isDark, onToggleTheme, onClear, canClear }) {
  return (
    <AppBar
      position="static"
      elevation={0}
      color="transparent"
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
        flexShrink: 0,
      }}
    >
      <Toolbar sx={{ gap: { xs: 0.5, sm: 1 }, minHeight: { xs: 60, sm: 68 } }}>
        <Avatar
          sx={{
            background: brandGradient(isDark),
            color: '#fff',
            width: 42,
            height: 42,
            boxShadow: 2,
          }}
        >
          <SmartToyRoundedIcon />
        </Avatar>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            noWrap
            sx={{
              lineHeight: 1.1,
              background: brandGradient(isDark),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {BOT_NAME}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box className="status-dot" />
            <Typography variant="caption" color="text.secondary" noWrap>
              {BOT_TAGLINE}
            </Typography>
          </Box>
        </Box>

        <Tooltip title="Message me on WhatsApp">
          <IconButton
            component="a"
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message me on WhatsApp"
            sx={{
              color: '#25D366',
              '&:hover': { color: '#1ebe57', bgcolor: 'rgba(37,211,102,0.12)' },
            }}
          >
            <WhatsAppIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Clear conversation">
          <span>
            <IconButton onClick={onClear} disabled={!canClear} aria-label="Clear conversation">
              <DeleteSweepRoundedIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
          <IconButton onClick={onToggleTheme} aria-label="Toggle theme">
            {isDark ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
