export { default as dark } from './themes/dark.css';
export { default as light } from './themes/light.css';

export { themeContract } from './contract.css';

export const defaultTheme = 'light' as const;

export type Theme = 'light' | 'dark';
