import { DECIMAL_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Decimal validation type.
 */
export type DecimalValidation<TInput extends string> =
  BaseValidation<TInput> & {
    /**
     * The validation type.
     */
    type: 'decimal';
    /**
     * The decimal regex.
     */
    requirement: RegExp;
  };

/**
 * Creates a pipeline validation action that validates a [decimal](https://en.wikipedia.org/wiki/Decimal).
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function decimal<TInput extends string>(
  message?: ErrorMessage
): DecimalValidation<TInput> {
  return {
    type: 'decimal',
    expects: null,
    async: false,
    message,
    requirement: DECIMAL_REGEX,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, decimal, input, 'decimal');
    },
  };
}
