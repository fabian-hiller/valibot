import fs from 'node:fs';
import path from 'node:path';

const ORIGIN = 'https://valibot.dev';

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
    if (itemName === 'index.tsx' || itemName === 'index.mdx') {
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
 * Generates the sitemap of the website.
 */
async function generateSitemap() {
  // Find all route index files
  const filePaths = findIndexFiles(path.join('src', 'routes'));

  // Create URL paths and sort them
  let urlSet = filePaths
    // Transform file paths to URL paths
    .map((filePath) =>
      filePath
        .replace(/\\/g, '/')
        .replace(/src\/routes\//, '')
        .replace(/\(.+\)\//, '')
        .replace(/index\.(tsx|mdx)/, '')
    )
    // Sort URL paths alphabetically
    .sort()
    // Reduce URL paths to URL set
    .reduce(
      (urlPaths, urlPath) =>
        `${urlPaths}<url><loc>${ORIGIN}/${urlPath}</loc></url>`,
      ''
    );

  // Add thesis to URL set
  urlSet += `<url><loc>${ORIGIN}/thesis.pdf</loc></url>`;

  // Write sitemap.xml to public directory
  fs.writeFileSync(
    path.join('public', 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlSet}</urlset>`
  );
}

// Start generation of sitemap
generateSitemap();
