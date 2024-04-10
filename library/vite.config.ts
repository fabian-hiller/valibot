import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    test: {
      environment: 'jsdom',
      fileParallelism: false,
      isolate: false,
      coverage: {
        include: ['src'],
        exclude: [
          'src/types',
          'src/vitest',
          'src/regex.ts',
          '**/index.ts',
          '**/types.ts',
          '**/*.test.ts',
          '**/*.test-d.ts',
        ],
      },
    },
  };
});
