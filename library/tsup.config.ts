import path from 'node:path';
import { defineConfig, type Options } from 'tsup';
// eslint-disable-next-line import/extensions
import { findNestedFiles } from './scripts/utils/index';

// Create tsup options
const tsupOptions: Options[] = [];

// Add main module to tsup options
tsupOptions.push({
  entry: ['./src/index.ts'],
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  outDir: './dist',
});

// Find all i18n file paths
const i18nFiles = findNestedFiles([path.join('src', 'i18n')], (fileName) =>
  fileName.endsWith('.ts')
);

// Add i18n submodules to tsup options
i18nFiles.forEach((filePath) => {
  tsupOptions.push({
    entry: [filePath],
    clean: true,
    bundle: false,
    format: ['esm', 'cjs'],
    dts: true,
    outDir: path.join(filePath.replace('src/', ''), '..'),
  });
});

// Export tsup options
export default defineConfig(tsupOptions);
