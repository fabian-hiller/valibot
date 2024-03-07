import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Not length validation type.
 */
export interface NotLengthValidation<
  TInput extends string | any[],
  TRequirement extends number,
> extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'not_length';
  /**
   * The length.
   */
  requirement: TRequirement;
}

/**
 * Creates a pipeline validation action that validates the length of a string
 * or array.
 *
 * @param requirement The length.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function notLength<
  TInput extends string | any[],
  TRequirement extends number,
>(
  requirement: TRequirement,
  message?: ErrorMessage
): NotLengthValidation<TInput, TRequirement> {
  return {
    type: 'not_length',
    expects: `!${requirement}`,
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (input.length !== this.requirement) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, notLength, input, 'length', `${input.length}`);
    },
  };
}
