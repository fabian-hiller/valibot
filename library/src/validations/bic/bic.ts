import { BIC_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Bic validation type.
 */
export interface BicValidation<TInput extends string>
  extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'bic';
  /**
   * The BIC regex.
   */
  requirement: RegExp;
}

/**
 * Creates a pipeline validation action that validates a [BIC](https://en.wikipedia.org/wiki/ISO_9362).
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function bic<TInput extends string>(
  message?: ErrorMessage
): BicValidation<TInput> {
  return {
    type: 'bic',
    expects: null,
    async: false,
    message,
    requirement: BIC_REGEX,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, bic, input, 'BIC');
    },
  };
}
