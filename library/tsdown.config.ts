import { defineConfig } from 'tsdown';

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
    outExtensions: ({ format }) => ({
      js: format === 'cjs' ? '.min.cjs' : '.min.js',
    }),
  },
]);
