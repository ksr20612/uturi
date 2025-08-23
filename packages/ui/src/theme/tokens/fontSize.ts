export const fontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
} as const;

export type FontSizeKey = keyof typeof fontSize;

export const createFontSizeVariants = <T extends string>(property: T) => {
  return Object.fromEntries(
    Object.entries(fontSize).map(([key, value]) => [key, { [property]: value }]),
  ) as Record<FontSizeKey, Record<T, string>>;
};
