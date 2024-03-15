import graymatter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import { findNestedFiles } from './utils/index';

// Find all MDX files of API reference
const filePaths = findNestedFiles(
  [path.join('src', 'routes', 'api')],
  (fileName) => fileName === 'index.mdx'
);

// Update source file paths of MDX files
for (const filePath of filePaths) {
  if (!filePath.includes('(types)')) {
    // Log info to console
    console.log('Update:', filePath);

    // Get group and name of source code file
    const pathList = filePath.split('/');
    let group = pathList.slice(3, 4)[0].replace('(', '').replace(')', '');
    const name = pathList.slice(4, 5)[0];

    // If group is async, find non-async group
    if (group === 'async') {
      const nonAsync = filePaths.find(
        (filePath) =>
          !filePath.includes('(async)') &&
          filePath.includes(name.replace('Async', ''))
      );
      group = nonAsync!
        .split('/')
        .slice(3, 4)[0]
        .replace('(', '')
        .replace(')', '');
    }

    // Create path to source code file
    const source = `/${group}/${name.replace('Async', '')}/${name}.ts`;

    // Read frontmatter of MDX file
    const frontmatter = graymatter.read(filePath);

    // Add source code file path to frontmatter
    frontmatter.data.source = source;

    // Write changes to MDX file
    fs.writeFileSync(
      filePath,
      graymatter.stringify(frontmatter.content, frontmatter.data)
    );
  }
}
