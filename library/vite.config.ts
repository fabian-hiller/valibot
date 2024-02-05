import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    test: {
      environment: 'jsdom',
      fileParallelism: false,
      isolate: false,
    },
  };
});
