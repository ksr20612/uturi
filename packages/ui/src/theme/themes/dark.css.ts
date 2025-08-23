import { createTheme } from '@vanilla-extract/css';

import { themeContract } from '../contract.css';
import { colors } from '../tokens/colors';
import { fontSize } from '../tokens/fontSize';
import { fontWeight } from '../tokens/fontWeight';
import { spacing } from '../tokens/spacing';

const darkTheme = createTheme(themeContract, {
  colors: {
    primary: {
      lighter: colors.blue[30],
      light: colors.blue[40],
      main: colors.blue[50],
      dark: colors.blue[60],
      darker: colors.blue[70],
    },
    secondary: {
      lighter: colors.purple[30],
      light: colors.purple[40],
      main: colors.purple[50],
      dark: colors.purple[60],
      darker: colors.purple[70],
    },
    tertiary: {
      lighter: colors.gray[30],
      light: colors.gray[20],
      main: colors.gray[10],
      dark: colors.gray[40],
      darker: colors.gray[60],
    },
    gray: {
      10: colors.gray[100],
      20: colors.gray[90],
      30: colors.gray[80],
      40: colors.gray[70],
      50: colors.gray[60],
      60: colors.gray[50],
      70: colors.gray[40],
      80: colors.gray[30],
      90: colors.gray[20],
      100: colors.gray[10],
    },
  },
  spacing: {
    0: spacing[0],
    1: spacing[1],
    2: spacing[2],
    3: spacing[3],
    4: spacing[4],
    5: spacing[5],
    6: spacing[6],
    8: spacing[8],
    10: spacing[10],
    12: spacing[12],
    16: spacing[16],
    20: spacing[20],
    24: spacing[24],
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

export default darkTheme;
