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

  // Write content of file
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.writeFileSync(
    filePath,
    fileContent
      // Rewrite relative module imports
      .replace(
        /import (\{[^}]+\}) from 'valibot'; \/\/ ('[^']+')/gu,
        'import $1 from $2;'
      )
      // Rewrite relative submodule imports
      .replace(/import 'valibot[^']*'; \/\/ ('[^']+')/gu, 'import $1;')
  );
});
