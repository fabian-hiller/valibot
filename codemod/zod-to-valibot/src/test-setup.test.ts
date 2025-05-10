import transform from './transform';
import { defineTests } from './utils';

// maintain the sorted order
defineTests(transform, [
  'coerce-bigint-schema',
  'coerce-boolean-schema',
  'coerce-date-schema',
  'coerce-number-schema',
  'coerce-string-schema',
  'default-import',
  'default-import-with-alias',
  'default-import-with-specific-alias',
  'describe',
  'named-import',
  'named-import-with-alias',
  'named-import-with-specific-alias',
  'namespace-import',
  'schema-chain',
  'schema-options',
  'specific-default-import',
  'specific-namespace-import',
]);
