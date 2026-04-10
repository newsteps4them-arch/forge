export const theme = {
  colors: {
    background: '#0D0D0D',
    surface: '#1A1A1A',
    card: '#222222',
    border: '#2E2E2E',
    primary: '#F5A623',      // amber/ember
    primaryDim: '#7A4F0D',
    text: '#F5F5F5',
    textSecondary: '#9A9A9A',
    textDim: '#555555',
    success: '#4CAF50',
    error: '#E53935',
  },
  fonts: {
    heading: {
      fontSize: 32,
      fontWeight: '700' as const,
      color: '#F5F5F5',
      letterSpacing: 0.5,
    },
    subheading: {
      fontSize: 18,
      fontWeight: '500' as const,
      color: '#F5F5F5',
    },
    body: {
      fontSize: 15,
      fontWeight: '400' as const,
      color: '#9A9A9A',
      lineHeight: 22,
    },
    hint: {
      fontSize: 13,
      fontWeight: '400' as const,
      color: '#555555',
      fontStyle: 'italic' as const,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      letterSpacing: 0.5,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 8,
    md: 14,
    lg: 24,
    full: 999,
  },
};
