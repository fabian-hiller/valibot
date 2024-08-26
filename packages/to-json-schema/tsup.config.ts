import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    clean: true,
    format: ['esm', 'cjs'],
    minify: false,
    dts: true,
    outDir: './dist',
  },
  {
    entry: ['./src/index.ts'],
    clean: true,
    format: ['esm', 'cjs'],
    minify: true,
    dts: false,
    outDir: './dist',
    outExtension: ({ format }) => ({
      js: format === 'cjs' ? '.min.cjs' : '.min.js',
    }),
  },
]);
