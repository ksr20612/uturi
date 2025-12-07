import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@utils': resolve(__dirname, 'src/utils'),
      '@components': resolve(__dirname, 'src/components'),
      '@core': resolve(__dirname, 'src/core'),
      '@typings': resolve(__dirname, 'src/typings'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UturiMaru',
      fileName: (format) => {
        return `index.${format === 'es' ? 'mjs' : 'js'}`;
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
});
