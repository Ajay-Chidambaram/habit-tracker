export const COLORS = {
  bg: {
    base: '#0a0f14',
    surface: '#0f1419',
    elevated: '#151c24',
    overlay: '#1a232d',
  },
  text: {
    primary: '#f0f4f8',
    secondary: '#8899a6',
    muted: '#5b6c7a',
  },
  accent: {
    green: '#4ade80',
    blue: '#22d3ee',
    purple: '#a78bfa',
    amber: '#fbbf24',
    rose: '#fb7185',
    orange: '#fb923c',
  },
  status: {
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#22d3ee',
  }
} as const

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
    case 'active':
      return COLORS.status.success
    case 'paused':
      return COLORS.status.warning
    case 'abandoned':
    case 'dropped':
      return COLORS.status.error
    default:
      return COLORS.text.secondary
  }
}
