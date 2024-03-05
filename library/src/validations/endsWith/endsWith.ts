import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Ends with validation type.
 */
export type EndsWithValidation<
  TInput extends string,
  TRequirement extends string,
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'ends_with';
  /**
   * The end string.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the end of a string.
 *
 * @param requirement The end string.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function endsWith<TInput extends string, TRequirement extends string>(
  requirement: TRequirement,
  message?: ErrorMessage
): EndsWithValidation<TInput, TRequirement> {
  return {
    type: 'ends_with',
    expects: `"${requirement}"`,
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (input.endsWith(this.requirement)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(
        this,
        endsWith,
        input,
        'end',
        `"${input.slice(-this.requirement.length)}"`
      );
    },
  };
}
