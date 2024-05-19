import type { BaseIssue } from '../../types/index.ts';

/**
 * Tuple with rest issue type.
 */
export interface TupleWithRestIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'tuple_with_rest';
  /**
   * The expected property.
   */
  readonly expected: 'Array';
}
