import type { BaseIssue, MaybePromise } from '../../types/index.ts';

/**
 * Partial check issue type.
 */
export interface PartialCheckIssue<TInput> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'partial_check';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The validation function.
   */
  readonly requirement: (input: TInput) => MaybePromise<boolean>;
}
