import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
      },
      name: 'UturiHaptification',
      fileName: (format, entryName) => {
        return `${entryName}.${format === 'es' ? 'mjs' : 'js'}`;
      },
    },
    minify: 'esbuild',
    sourcemap: false,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
});
