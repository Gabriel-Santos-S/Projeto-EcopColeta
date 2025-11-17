import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: 'hsl(142, 76%, 36%)',
      light: 'hsl(142, 70%, 45%)',
      dark: 'hsl(142, 80%, 28%)',
      contrastText: '#ffffff',
    },
    secondary: {
      main: 'hsl(207, 90%, 54%)',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: 'hsl(142, 71%, 15%)',
      secondary: 'hsl(142, 10%, 40%)',
    },
    error: {
      main: 'hsl(0, 84%, 60%)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});
