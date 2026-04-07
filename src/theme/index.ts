export { colors } from './colors';
export { typography } from './typography';
export { fonts } from './fonts';

export const spacing = {
  xs: 4,
  sm: 8,
  smd: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

// 64px bar + 16px bottom offset (absolute positioned)
export const TAB_BAR_HEIGHT = 80;
