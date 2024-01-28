import fs from 'node:fs';
import path from 'node:path';
// eslint-disable-next-line import/extensions
import { findNestedFiles } from './utils/index';

// Find all i18n file paths
const i18nFiles = findNestedFiles([path.join('src', 'i18n')], (fileName) =>
  fileName.endsWith('.ts')
);

// Rewrite imports of i18n files
i18nFiles.forEach((filePath) => {
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
});
