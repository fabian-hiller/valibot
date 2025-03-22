import fs from "node:fs";
import path from 'node:path';
import { findNestedFiles } from "./utils/index";
import graymatter from 'gray-matter';

const apiFilePaths = findNestedFiles(
  [path.join('src', 'routes', 'api')],
  (fileName) => fileName === 'index.mdx'
);

const guidesFilePaths = findNestedFiles(
  [path.join('src', 'routes', 'guides')],
  (fileName) => fileName === 'index.mdx'
);

const output: string[] = [];
apiFilePaths.map(filePath => {
  const frontmatter = graymatter.read(filePath);
  const content = frontmatter.content
    .replace(/import.*'~\/components';\n/, '')
    .replace(/import.*'.\/properties';\n/, '')
    .replace(/import.*'@builder\.io\/qwik-city';\n/, '')
    .trim();
  output.push(content, '\n\n');
});
guidesFilePaths.map(filePath => {
  if (filePath.includes('(migration)')) return;
  const frontmatter = graymatter.read(filePath);
  const content = frontmatter.content
    .replace(/import.*'~\/components';\n/, '')
    .replace(/import.*'.\/properties';\n/, '')
    .replace(/import.*'@builder\.io\/qwik-city';\n/, '')
    .replace('import MentalModelDark from \'./mental-model-dark.jpg?jsx\';\n', '')
    .replace('import MentalModelLight from \'./mental-model-light.jpg?jsx\';\n', '')
    .trim();
  output.push(content, '\n\n');
});

fs.writeFileSync(
  path.join('public', 'llms.txt'),
  output.join('')
);