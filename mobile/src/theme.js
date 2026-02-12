export const colors = {
  bgPrimary: '#0f0f13',
  bgSecondary: '#1a1a24',
  bgTertiary: '#242435',
  bgHover: '#2a2a3d',
  textPrimary: '#e8e8ed',
  textSecondary: '#9494a8',
  textMuted: '#6b6b80',
  accent: '#7c5cfc',
  accentHover: '#6a48e6',
  accentSubtle: 'rgba(124, 92, 252, 0.12)',
  border: '#2a2a3d',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  white: '#ffffff',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const fonts = {
  regular: { fontSize: 15, color: colors.textPrimary },
  small: { fontSize: 13, color: colors.textSecondary },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heading: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  subheading: { fontSize: 17, fontWeight: '600', color: colors.textPrimary },
};
