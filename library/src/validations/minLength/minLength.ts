import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Min length validation type.
 */
export type MinLengthValidation<
  TInput extends string | any[],
  TRequirement extends number,
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'min_length';
  /**
   * The minimum length.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the length of a string
 * or array.
 *
 * @param requirement The minimum length.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function minLength<
  TInput extends string | any[],
  TRequirement extends number,
>(
  requirement: TRequirement,
  message?: ErrorMessage
): MinLengthValidation<TInput, TRequirement> {
  return {
    type: 'min_length',
    expects: `>=${requirement}`,
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (input.length >= this.requirement) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, minLength, input, 'length', `${input.length}`);
    },
  };
}
