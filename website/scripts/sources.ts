import fs from 'node:fs';
import path from 'node:path';
import graymatter from 'gray-matter';

/**
 * Finds all index files in the given directory.
 *
 * @param directory The directory to search in.
 */
function findIndexFiles(directory: string) {
  // Create file paths list
  const filePaths: string[] = [];

  // Get items of directory
  const items = fs.readdirSync(directory);

  for (const itemName of items) {
    // If item is a index file, add it to list
    if (itemName === 'index.mdx') {
      filePaths.push(path.join(directory, itemName));

      // Otherwise, search for nested index files
    } else {
      const itemPath = path.join(directory, itemName);
      const itemStat = fs.statSync(itemPath);
      if (itemStat.isDirectory()) {
        filePaths.push(...findIndexFiles(itemPath));
      }
    }
  }

  // Return file paths list
  return filePaths;
}

/**
 * Updates the source file paths of the API reference.
 */
async function updateSources() {
  // Find all MDX files of API reference
  const filePaths = findIndexFiles(path.join('src', 'routes', 'api'));

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
}

// Start update process
updateSources();
