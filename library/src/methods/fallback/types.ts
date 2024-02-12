import type { SchemaIssues } from '../../types/index.ts';

/**
 * Fallback info type.
 */
export type FallbackInfo = {
  input: unknown;
  issues: SchemaIssues;
};
