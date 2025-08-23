export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

export type SpacingKey = keyof typeof spacing;

export const createSpacingVariants = <T extends string>(property: T) => {
  return Object.fromEntries(
    Object.entries(spacing).map(([key, value]) => [key, { [property]: value }]),
  ) as Record<SpacingKey, Record<T, string>>;
};
