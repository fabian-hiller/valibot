import { defineConfig } from 'tsup';
import path from 'node:path';

const resolveAlias = {
  name: 'resolveAlias',
  setup(build: {onResolve: Function}) {
    // Handle `./regex.ts`, `../../regex.ts`, etc.
    build.onResolve({filter: /^[./]+\/regex\.ts$/}, () => ({
      path: path.resolve(__dirname, './transpiled/regex.ts'),
    }));
  },
};

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    clean: true,
    format: ['esm', 'cjs'],
    minify: false,
    dts: true,
    outDir: './dist',
    esbuildPlugins: [resolveAlias],
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
    esbuildPlugins: [resolveAlias],
  },
]);
