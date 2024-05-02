import type { BaseIssue } from '../../types/index.ts';

/**
 * Tuple issue type.
 */
export interface TupleIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'tuple';
  /**
   * The expected input.
   */
  readonly expected: 'Array';
}
