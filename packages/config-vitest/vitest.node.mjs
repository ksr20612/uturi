import { defineConfig } from 'vitest/config';
import baseConfig from './vitest.base.mjs';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    environment: 'node',
    setupFiles: [],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    exclude: [...baseConfig.test.exclude, '**/*.{jsx,tsx}'],
  },
});
