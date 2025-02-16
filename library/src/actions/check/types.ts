import type { BaseIssue, MaybePromise } from '../../types/index.ts';

/**
 * Check issue interface.
 */
export interface CheckIssue<TInput> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'check';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The validation function.
   */
  readonly requirement: (input: TInput) => MaybePromise<boolean>;
}
