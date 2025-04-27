import transform from './transform';
import { defineTests } from './utils';

// maintain the sorted order
defineTests(transform, [
  'default-import',
  'default-import-with-alias',
  'default-import-with-specific-alias',
  'named-import',
  'named-import-with-alias',
  'named-import-with-specific-alias',
  'namespace-import',
  'specific-default-import',
  'specific-namespace-import',
]);
