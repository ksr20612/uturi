import { defineConfig } from 'vitest/config';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import browserConfig from '@uturi/config-vitest/vitest.browser.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  ...browserConfig,
  resolve: {
    alias: {
      '@utils': resolve(__dirname, 'src/utils'),
      '@components': resolve(__dirname, 'src/components'),
      '@core': resolve(__dirname, 'src/core'),
      '@typings': resolve(__dirname, 'src/typings'),
    },
  },
  test: {
    ...browserConfig.test,
    environment: 'jsdom',
    setupFiles: ['@uturi/config-vitest/vitest.setup.mjs'],
    globals: true,
    exclude: ['tests/e2e/**/*', 'node_modules/**/*', '**/node_modules/**/*'],
  },
});
