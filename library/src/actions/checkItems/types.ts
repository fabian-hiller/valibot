import type { BaseIssue } from '../../types';
import type { ArrayInput, ArrayRequirementAsync } from '../types';

/**
 * Check items issue type.
 */
export interface CheckItemsIssue<TInput extends ArrayInput>
  extends BaseIssue<TInput[number]> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'check_items';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The validation function.
   */
  readonly requirement: ArrayRequirementAsync<TInput>;
}
