export const theme = {
  colors: {
    primary: '#10b981',
    primaryDark: '#059669',
    secondary: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    dark: '#1f2937',
    darkGray: '#374151',
    gray: '#6b7280',
    lightGray: '#9ca3af',
    veryLightGray: '#e5e7eb',
    white: '#ffffff',
    black: '#000000',
    background: '#f9fafb',
    cardBackground: '#ffffff',
    border: '#e5e7eb',
    text: '#111827',
    textSecondary: '#6b7280',
    textLight: '#9ca3af',
    overlay: 'rgba(0, 0, 0, 0.5)',
    success10: 'rgba(34, 197, 94, 0.1)',
    warning10: 'rgba(245, 158, 11, 0.1)',
    danger10: 'rgba(239, 68, 68, 0.1)',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },
} as const;

export type Theme = typeof theme;
