import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    test: {
      environment: 'jsdom',
    },
    build: {
      target: 'ESNext',
      outDir: 'dist',
      lib: {
        entry: './src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      minify: false,
    },
  };
});
