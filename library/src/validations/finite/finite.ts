import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Finite validation type.
 */
export type FiniteValidation<TInput extends number> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'finite';
  /**
   * The validation function.
   */
  requirement: (input: TInput) => boolean;
};

/**
 * Creates a pipeline validation action that validates whether a number is finite.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function finite<TInput extends number>(
  message?: ErrorMessage
): FiniteValidation<TInput> {
  return {
    type: 'finite',
    expects: null,
    async: false,
    message,
    requirement: Number.isFinite,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, finite, input, 'finite');
    },
  };
}
