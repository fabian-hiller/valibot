import type { BaseIssue } from '../../types/index.ts';

/**
 * Tuple issue interface.
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
   * The expected property.
   */
  readonly expected: 'Array';
}
