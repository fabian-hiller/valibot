import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Starts with validation type.
 */
export type StartsWithValidation<
  TInput extends string,
  TRequirement extends string
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'starts_with';
  /**
   * The start string.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the start of a string.
 *
 * @param requirement The start string.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function startsWith<TInput extends string, TRequirement extends string>(
  requirement: TRequirement,
  message?: ErrorMessage
): StartsWithValidation<TInput, TRequirement> {
  return {
    type: 'starts_with',
    expects: `"${requirement}"`,
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (input.startsWith(this.requirement)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(
        this,
        startsWith,
        input,
        'start',
        `"${input.slice(0, this.requirement.length)}"`
      );
    },
  };
}
