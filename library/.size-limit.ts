import type { SizeLimitConfig } from 'size-limit';

module.exports = [
  {
    name: `import * as v from 'valibot' (ESM)`,
    path: ['dist/index.js'],
    import: '*',
    limit: '10.35KB',
  },
  // Core
  {
    name: `import { parser } from 'valibot' (ESM)`,
    path: ['dist/index.js'],
    import: '{ parser }',
    limit: '335KB',
  },
  // Functions
  {
    name: `import { pipe } from 'valibot' (ESM)`,
    path: ['dist/index.js'],
    import: '{ pipe }',
    limit: '370B',
  },
  // Schemas
  {
    name: `import { array } from 'valibot' (ESM)`,
    path: ['dist/index.js'],
    import: '{ array }',
    limit: '815B',
  },
] satisfies SizeLimitConfig;
