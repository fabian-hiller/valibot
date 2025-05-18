import transform from './transform';
import { defineTests } from './utils';

// maintain the sorted order
defineTests(transform, [
  'bigint-validation-methods',
  'coerce-bigint-schema',
  'coerce-boolean-schema',
  'coerce-date-schema',
  'coerce-number-schema',
  'coerce-string-schema',
  'date-validation-methods',
  'default-import',
  'default-import-with-alias',
  'default-import-with-specific-alias',
  'describe',
  'literal-schema',
  'named-import',
  'named-import-with-alias',
  'named-import-with-specific-alias',
  'namespace-import',
  'number-validation-methods',
  'parsing',
  'schema-chain',
  'schema-options',
  'specific-default-import',
  'specific-namespace-import',
  'string-validation-methods',
  'validation-error-msg',
]);
