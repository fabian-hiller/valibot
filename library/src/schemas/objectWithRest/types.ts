import type { BaseIssue } from '../../types/index.ts';

/**
 * Object with rest issue type.
 */
export interface ObjectWithRestIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'object_with_rest';
  /**
   * The expected property.
   */
  readonly expected: 'Object';
}
