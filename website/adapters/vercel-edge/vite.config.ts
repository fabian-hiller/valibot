import { vercelEdgeAdapter } from '@builder.io/qwik-city/adapters/vercel-edge/vite';
import { extendConfig } from '@builder.io/qwik-city/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import baseConfig from '../../vite.config';

export default extendConfig(baseConfig, () => {
  return {
    ssr: {
      external: ['@vercel/og'],
    },
    build: {
      ssr: true,
      rollupOptions: {
        input: ['src/entry.vercel-edge.tsx', '@qwik-city-plan'],
      },
      outDir: '.vercel/output/functions/_qwik-city.func',
    },
    plugins: [
      vercelEdgeAdapter({
        ssg: {
          include: [],
          sitemapOutFile: null,
        },
      }),
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/@vercel/og/**/*',
            dest: 'node_modules/@vercel/og/',
          },
        ],
      }),
    ],
  };
});
