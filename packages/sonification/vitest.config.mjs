import { defineConfig } from 'vitest/config';
import browserConfig from '@uturi/config-vitest/vitest.browser.mjs';

export default defineConfig({
  ...browserConfig,
  test: {
    ...browserConfig.test,
    environment: 'jsdom',
    setupFiles: ['@uturi/config-vitest/vitest.setup.mjs'],
    globals: true,
    exclude: ['tests/e2e/**/*', 'node_modules/**/*', '**/node_modules/**/*'],
  },
});
