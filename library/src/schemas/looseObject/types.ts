import type { BaseIssue } from '../../types/index.ts';

/**
 * Loose object issue interface.
 */
export interface LooseObjectIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'loose_object';
  /**
   * The expected property.
   */
  readonly expected: 'Object' | `"${string}"`;
}
