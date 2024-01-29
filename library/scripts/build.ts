import fs from 'node:fs';
import path from 'node:path';
import { build } from 'tsup';
// eslint-disable-next-line import/extensions
import { findNestedFiles } from './utils/index';

// Bundle main module with tsup
await build({
  entry: ['./src/index.ts'],
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  outDir: './dist',
});

// Clean i18n outout directory
fs.rmSync(path.join('i18n'), { recursive: true, force: true });

// Find all i18n source files
const i18nFiles = findNestedFiles([path.join('src', 'i18n')], (fileName) =>
  fileName.endsWith('.ts')
);

// Bundle i18n submodules in batches
const BATCH_SIZE = 10;
for (let index = 0; index < i18nFiles.length; index += BATCH_SIZE) {
  const batch = i18nFiles.slice(index, index + BATCH_SIZE);

  // Bundle batch asynchronously
  await Promise.all(
    batch.map(async (filePath) => {
      // Read content of file
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const fileContent = fs.readFileSync(filePath).toString();

      // Create submodule path
      const submodulePath = `valibot/${path.join(
        filePath.replace('src/', ''),
        '..'
      )}`;

      // Write content of file
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.writeFileSync(
        filePath,
        fileContent
          // Rewrite relative module imports
          .replace(
            /import (\{[^}]+\}) from ('[^']+');/gu,
            "import $1 from 'valibot'; // $2"
          )
          // Rewrite relative submodule imports
          .replace(
            /import '\.\/([^']+)\/index\.ts';/gu,
            `import '${submodulePath}/$1'; // './$1/index.ts'`
          )
          .replace(
            /import '\.\/([^']+)\.ts';/gu,
            `import '${submodulePath}/$1'; // './$1.ts'`
          )
      );

      // Bundle i18n submodule with tsup
      await build({
        entry: [filePath],
        clean: false,
        bundle: false,
        format: ['esm', 'cjs'],
        dts: true,
        outDir: path.join(filePath.replace('src/', ''), '..'),
      });

      // Undo rewrite of imports
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.writeFileSync(filePath, fileContent);
    })
  );
}
