import type { BaseIssue, MaybePromise } from '../../types/index.ts';

/**
 * Partial input type.
 */
export type PartialInput = Record<string, unknown> | ArrayLike<unknown>;

/**
 * Partial check issue type.
 */
export interface PartialCheckIssue<TInput extends PartialInput>
  extends BaseIssue<TInput> {
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
