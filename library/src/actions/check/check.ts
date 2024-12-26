import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { CheckIssue } from './types.ts';

/**
 * Check action type.
 */
export interface CheckAction<
  TInput,
  TMessage extends ErrorMessage<CheckIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, CheckIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'check';
  /**
   * The action reference.
   */
  readonly reference: typeof check;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The validation function.
   */
  readonly requirement: (input: TInput) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a check validation action.
 *
 * @param requirement The validation function.
 *
 * @returns A check action.
 */
export function check<TInput>(
  requirement: (input: TInput) => boolean
): CheckAction<TInput, undefined>;

/**
 * Creates a check validation action.
 *
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns A check action.
 */
export function check<
  TInput,
  const TMessage extends ErrorMessage<CheckIssue<TInput>> | undefined,
>(
  requirement: (input: TInput) => boolean,
  message: TMessage
): CheckAction<TInput, TMessage>;

// @__NO_SIDE_EFFECTS__
export function check(
  requirement: (input: unknown) => boolean,
  message?: ErrorMessage<CheckIssue<unknown>>
): CheckAction<unknown, ErrorMessage<CheckIssue<unknown>> | undefined> {
  return {
    kind: 'validation',
    type: 'check',
    reference: check,
    async: false,
    expects: null,
    requirement,
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !this.requirement(dataset.value)) {
        _addIssue(this, 'input', dataset, config);
      }
      return dataset;
    },
  };
}
