import type { BaseIssue } from '../../types/index.ts';

/**
 * Array issue interface.
 */
export interface ArrayIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'array';
  /**
   * The expected property.
   */
  readonly expected: 'Array';
}
