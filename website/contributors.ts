import { fetch } from 'undici';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', override: true });

/**
 * NOTE: Please create .env.local, and set your own GITHUB_PERSONAL_ACCESS_TOKEN.
 *       This token is required because of the GitHub API rate limit.
 *       https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting
 */

const GITHUB_PERSONAL_ACCESS_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

async function updateContributors() {
  if (!GITHUB_PERSONAL_ACCESS_TOKEN) {
    throw new Error('Missing GITHUB_PERSONAL_ACCESS_TOKEN');
  }

  const routesDir = path.join('src', 'routes');
  await updateDocsDir(routesDir);
}

async function updateDocsDir(dir: string) {
  const items = fs.readdirSync(dir);
  for (const itemName of items) {
    if (itemName === 'index.mdx') {
      await updateGithubCommits(path.join(dir, itemName));
    } else {
      const itemPath = path.join(dir, itemName);
      const itemStat = fs.statSync(itemPath);
      if (itemStat.isDirectory()) {
        await updateDocsDir(itemPath);
      }
    }
  }
}

async function updateGithubCommits(filePath: string) {
  console.log('update:', filePath);

  const gm = matter.read(filePath);

  const repoPath = filePath.replace(/\\/g, '/');
  const url = new URL(
    `https://api.github.com/repos/fabian-hiller/valibot/commits`
  );
  url.searchParams.set('since', new Date('2023-07-13').toISOString());
  url.searchParams.set('path', repoPath);

  const response = await fetch(url.href, {
    headers: {
      Authorization: `Bearer ${GITHUB_PERSONAL_ACCESS_TOKEN}`,
    },
  });
  if (response.status !== 200) {
    console.log(
      'error',
      response.status,
      response.statusText,
      await response.text()
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return;
  }

  const commits: any = await response.json();
  if (!Array.isArray(commits)) {
    console.log('error', JSON.stringify(commits));
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return;
  }

  const contributors: { author: string; count: number }[] = [];

  for (const commit of commits) {
    const author = commit?.author?.login;
    if (author) {
      const contributor = contributors.find((c) => c.author === author);
      if (contributor) {
        contributor.count++;
      } else {
        contributors.push({ author, count: 1 });
      }
    }
  }

  contributors.sort((a, b) => {
    if (a.count > b.count) {
      return -1;
    }
    if (a.count < b.count) {
      return 1;
    }
    return 0;
  });

  gm.data.contributors = gm.data.contributors || [];
  for (const contributor of contributors) {
    if (!gm.data.contributors.includes(contributor.author)) {
      gm.data.contributors.push(contributor.author);
    }
  }

  const md = matter.stringify(gm.content, gm.data);

  fs.writeFileSync(filePath, md);

  console.log(repoPath, contributors.length);

  await new Promise((resolve) => setTimeout(resolve, 1000));
}

updateContributors();
