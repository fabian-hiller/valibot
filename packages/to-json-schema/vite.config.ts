/// <reference types="vitest" />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    isolate: false,
    coverage: {
      include: ['src'],
      exclude: ['**/index.ts', '**/types.ts', '**/*.test.ts'],
    },
  },
});
