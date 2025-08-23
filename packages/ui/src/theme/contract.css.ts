import { createThemeContract } from '@vanilla-extract/css';

import { fontSize } from './tokens/fontSize';
import { fontWeight } from './tokens/fontWeight';

export const themeContract = createThemeContract({
  colors: {
    primary: {
      lighter: null,
      light: null,
      main: null,
      dark: null,
      darker: null,
    },
    secondary: {
      lighter: null,
      light: null,
      main: null,
      dark: null,
      darker: null,
    },
    tertiary: {
      lighter: null,
      light: null,
      main: null,
      dark: null,
      darker: null,
    },
    gray: {
      10: null,
      20: null,
      30: null,
      40: null,
      50: null,
      60: null,
      70: null,
      80: null,
      90: null,
      100: null,
    },
  },
  spacing: {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    8: null,
    10: null,
    12: null,
    16: null,
    20: null,
    24: null,
  },
  fontSize: {
    xs: fontSize.xs,
    sm: fontSize.sm,
    md: fontSize.md,
    lg: fontSize.lg,
    xl: fontSize.xl,
    '2xl': fontSize['2xl'],
    '3xl': fontSize['3xl'],
    '4xl': fontSize['4xl'],
  },
  fontWeight: {
    light: fontWeight.light,
    normal: fontWeight.normal,
    medium: fontWeight.medium,
    semibold: fontWeight.semibold,
    bold: fontWeight.bold,
    extrabold: fontWeight.extrabold,
    black: fontWeight.black,
  },
});
