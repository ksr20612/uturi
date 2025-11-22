import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        core: resolve(__dirname, 'src/core/index.ts'),
        react: resolve(__dirname, 'src/react/index.ts'),
        vue: resolve(__dirname, 'src/vue/index.ts'),
        svelte: resolve(__dirname, 'src/svelte/index.ts'),
      },
      name: 'UturiSonification',
      fileName: (format, entryName) => {
        return `${entryName}.${format === 'es' ? 'mjs' : 'js'}`;
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'vue', 'svelte'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          vue: 'Vue',
          svelte: 'Svelte',
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
