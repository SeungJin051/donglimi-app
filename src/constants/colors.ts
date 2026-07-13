/**
 * 시맨틱 컬러 토큰 (JS/네이티브 스타일용)
 * tailwind.config.cjs 의 토큰과 동일한 값을 유지해야 합니다.
 */
export const COLORS = {
  primary: '#3182F6',
  primaryPressed: '#1B64DA',
  primarySoft: '#E8F3FF',

  bg: '#F2F4F6',
  surface: '#FFFFFF',
  surfacePressed: '#F2F4F6',
  divider: '#F2F4F6',
  stroke: '#E5E8EB',

  textPrimary: '#191F28',
  textSecondary: '#4E5968',
  textTertiary: '#8B95A1',
  textDisabled: '#B0B8C1',

  danger: '#F04452',
  dangerSoft: '#FDEDEE',
  success: '#12B76A',
  successSoft: '#E9F9F1',
} as const
