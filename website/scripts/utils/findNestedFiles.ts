import fs from 'node:fs';
import path from 'node:path';

/**
 * Finds nested files in the given directories.
 *
 * @param directories The directories to search in.
 * @param requirement The requirement for a file to be included.
 *
 * @returns A list of file paths.
 */
export function findNestedFiles(
  directories: string[],
  requirement: (fileName: string) => boolean
) {
  // Create file paths list
  const filePaths: string[] = [];

  // Search for index files in each directory
  for (const directory of directories) {
    // Get items of directory
    const items = fs.readdirSync(directory);

    for (const itemName of items) {
      // If item matches requirement, add it to list
      if (requirement(itemName)) {
        filePaths.push(path.join(directory, itemName));

        // Otherwise, search for nested files
      } else {
        const itemPath = path.join(directory, itemName);
        const itemStat = fs.statSync(itemPath);
        if (itemStat.isDirectory()) {
          filePaths.push(...findNestedFiles([itemPath], requirement));
        }
      }
    }
  }

  // Return file paths list
  return filePaths;
}
