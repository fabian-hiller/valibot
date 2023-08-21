import type { Issues } from '../../error/index.ts';

/**
 * Fallback info type.
 */
export type FallbackInfo = {
  input: unknown;
  issues: Issues;
};
