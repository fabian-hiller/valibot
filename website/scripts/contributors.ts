import { fetch } from 'undici';
import fs from 'node:fs';
import path from 'node:path';
import graymatter from 'gray-matter';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local', override: true });

/**
 * NOTE: Please create `.env.local`, and set your own `GITHUB_PERSONAL_ACCESS_TOKEN`.
 * This token is required because of the GitHub API rate limit. https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting
 * How to create a personal access token: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token
 */
const GITHUB_PERSONAL_ACCESS_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

/**
 * Finds all index files in the given directory.
 *
 * @param directories The directories to search in.
 */
async function findIndexFiles(directories: string[]) {
  // Create file paths list
  const filePaths: string[] = [];

  // Search for index files in each directory
  for (const directory of directories) {
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
          filePaths.push(...(await findIndexFiles([itemPath])));
        }
      }
    }
  }

  // Return file paths list
  return filePaths;
}

/**
 * Updates the contributors of the guides and API reference.
 */
async function updateContributors() {
  // Check if GitHub personal access token is available
  if (!GITHUB_PERSONAL_ACCESS_TOKEN) {
    throw new Error('Missing GITHUB_PERSONAL_ACCESS_TOKEN');
  }

  // Find all MDX files of guides and API reference
  const filePaths = await findIndexFiles([
    path.join('src', 'routes', 'guides'),
    path.join('src', 'routes', 'api'),
  ]);

  // Update contributors of each MDX file
  for (const filePath of filePaths) {
    // Log info to console
    console.log('Update:', filePath);

    // Read frontmatter of MDX file
    const frontmatter = graymatter.read(filePath);

    // Create API URL and add query parameters
    const url = new URL(
      'https://api.github.com/repos/fabian-hiller/valibot/commits'
    );
    url.searchParams.set('since', '2023-07-13T00:00:00.000Z');
    url.searchParams.set('path', `website/${filePath.replace(/\\/g, '/')}`);

    // Fetch commits of file from GitHub
    const response = await fetch(url.href, {
      headers: {
        Authorization: `Bearer ${GITHUB_PERSONAL_ACCESS_TOKEN}`,
      },
    });

    // Continue if GitHub responded with status code 200
    if (response.status === 200) {
      // Get commits from response
      const commits = (await response.json()) as {
        author: { login: string };
      }[];

      // Create contributors list
      const contributors: { author: string; count: number }[] = [];

      // Count commits of each author
      for (const commit of commits) {
        const author = commit.author.login;
        const contributor = contributors.find(
          (contributor) => contributor.author === commit.author.login
        );
        if (contributor) {
          contributor.count++;
        } else {
          contributors.push({ author, count: 1 });
        }
      }

      // Sort contributors by commit count
      contributors.sort((a, b) =>
        a.count < b.count ? 1 : a.count < b.count ? -1 : 0
      );

      // Add contributors to frontmatter
      frontmatter.data.contributors = contributors.map(
        (contributor) => contributor.author
      );

      // Write changes to MDX file
      fs.writeFileSync(
        filePath,
        graymatter.stringify(frontmatter.content, frontmatter.data)
      );

      // Otherwise, log error to console
    } else {
      console.log(
        'error',
        response.status,
        response.statusText,
        await response.text()
      );
    }
  }
}

// Start update process
updateContributors();
