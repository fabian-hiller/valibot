import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Safe integer validation type.
 */
export type SafeIntegerValidation<TInput extends number> =
  BaseValidation<TInput> & {
    /**
     * The validation type.
     */
    type: 'safe_integer';
    /**
     * The validation function.
     */
    requirement: (input: TInput) => boolean;
  };

/**
 * Creates a pipeline validation action that validates whether a number is a
 * safe integer.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function safeInteger<TInput extends number>(
  message?: ErrorMessage
): SafeIntegerValidation<TInput> {
  return {
    type: 'safe_integer',
    expects: null,
    async: false,
    message,
    requirement: Number.isSafeInteger,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, safeInteger, input, 'safe integer');
    },
  };
}
