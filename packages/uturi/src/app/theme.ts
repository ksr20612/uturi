'use client';

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: '#f0fdfa' },
          100: { value: '#ccfbf1' },
          200: { value: '#99f6e4' },
          300: { value: '#5eead4' },
          400: { value: '#2dd4bf' },
          500: { value: '#14b8a6' },
          600: { value: '#0d9488' },
          700: { value: '#0f766e' },
          800: { value: '#115e59' },
          900: { value: '#134e4a' },
          950: { value: '#042f2e' },
        },
        background: {
          DEFAULT: { value: '#111827' }, // gray.900
          card: { value: '#1f2937' }, // gray.800
          muted: { value: '#374151' }, // gray.700
        },
        foreground: {
          DEFAULT: { value: '#f9fafb' }, // gray.50
          muted: { value: '#d1d5db' }, // gray.300
          subtle: { value: '#9ca3af' }, // gray.400
        },
        border: {
          DEFAULT: { value: '#374151' }, // gray.700
          muted: { value: '#4b5563' }, // gray.600
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: '{colors.background.DEFAULT}' },
          card: { value: '{colors.background.card}' },
          muted: { value: '{colors.background.muted}' },
        },
        fg: {
          DEFAULT: { value: '{colors.foreground.DEFAULT}' },
          muted: { value: '{colors.foreground.muted}' },
          subtle: { value: '{colors.foreground.subtle}' },
        },
        primary: {
          DEFAULT: { value: '{colors.primary.500}' },
          hover: { value: '{colors.primary.400}' },
          active: { value: '{colors.primary.600}' },
          text: { value: '{colors.primary.400}' },
        },
        border: {
          DEFAULT: { value: '{colors.border.DEFAULT}' },
          muted: { value: '{colors.border.muted}' },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: 'bg.DEFAULT',
      color: 'fg.DEFAULT',
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
