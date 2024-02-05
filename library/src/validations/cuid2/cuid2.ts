import { CUID2_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Cuid2 validation type.
 */
export type Cuid2Validation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'cuid2';
  /**
   * The Cuid2 regex.
   */
  requirement: RegExp;
};

/**
 * Creates a pipeline validation action that validates a [Cuid2](https://github.com/paralleldrive/cuid2).
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function cuid2<TInput extends string>(
  message?: ErrorMessage
): Cuid2Validation<TInput> {
  return {
    type: 'cuid2',
    expects: null,
    async: false,
    message,
    requirement: CUID2_REGEX,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, cuid2, input, 'Cuid2');
    },
  };
}
