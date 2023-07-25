import rehypePrism from '@mapbox/rehype-prism';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import rehypeExternalLinks from 'rehype-external-links';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity({
        mdxPlugins: {
          remarkGfm: true,
          rehypeSyntaxHighlight: false,
          rehypeAutolinkHeadings: true,
        },
        mdx: {
          rehypePlugins: [
            rehypePrism,
            [rehypeExternalLinks, { rel: 'noreferrer', target: '_blank' }],
          ],
        },
      }),
      qwikVite(),
      tsconfigPaths(),
    ],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
  };
});
