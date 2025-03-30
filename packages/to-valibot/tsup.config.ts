import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./lib/index.ts'],
  clean: true,
  format: ['esm', 'cjs'],
  minify: false,
  dts: true,
  outDir: './dist',
});