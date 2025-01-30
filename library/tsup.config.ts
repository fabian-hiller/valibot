import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    clean: true,
    format: ['esm', 'cjs'],
    minify: false,
    dts: true,
    outDir: './dist',
    target: ['es2022', ...browserslistToEsbuild()],
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
    target: ['es2022', ...browserslistToEsbuild()],
  },
]);
