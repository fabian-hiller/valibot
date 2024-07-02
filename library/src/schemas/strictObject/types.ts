import type { BaseIssue } from '../../types/index.ts';

/**
 * Strict object issue type.
 */
export interface StrictObjectIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'strict_object';
  /**
   * The expected property.
   */
  readonly expected: 'Object' | 'never';
}
