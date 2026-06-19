import { createTheme } from '@mui/material/styles';

// A single source of truth for both colour schemes. `mode` is 'light' | 'dark'.
export const createAppTheme = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#818cf8' : '#6366f1', // indigo
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#22c55e', // WhatsApp-ish green for accents
      },
      background: {
        default: isDark ? '#0b1120' : '#eef2f7',
        paper: isDark ? '#111827' : '#ffffff',
      },
      text: {
        primary: isDark ? '#e5e7eb' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#64748b',
      },
      divider: isDark ? 'rgba(148,163,184,0.16)' : 'rgba(15,23,42,0.10)',
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      h6: { fontWeight: 700, letterSpacing: '-0.01em' },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { fontSize: '0.75rem', borderRadius: 8 },
        },
      },
    },
  });
};

// A subtle brand gradient reused across the header title and avatars.
export const brandGradient = (isDark) =>
  isDark
    ? 'linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)'
    : 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)';
