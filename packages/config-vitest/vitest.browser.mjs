import { defineConfig } from 'vitest/config';
import baseConfig from './vitest.base.mjs';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.mjs'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
  },
});
