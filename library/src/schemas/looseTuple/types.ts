import type { BaseIssue } from '../../types/index.ts';

/**
 * Loose tuple issue interface.
 */
export interface LooseTupleIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'loose_tuple';
  /**
   * The expected property.
   */
  readonly expected: 'Array';
}
