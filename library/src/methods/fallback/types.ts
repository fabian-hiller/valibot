import type { SchemaIssues } from '../../types/index.ts';

/**
 * Fallback info type.
 */
export interface FallbackInfo {
  input: unknown;
  issues: SchemaIssues;
}
