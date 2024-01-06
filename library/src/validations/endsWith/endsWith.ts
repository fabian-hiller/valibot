import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Ends with validation type.
 */
export interface EndsWithValidation<
  TInput extends string,
  TRequirement extends string
> extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'ends_with';
  /**
   * The end string.
   */
  requirement: TRequirement;
}

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
  message: ErrorMessage = 'Invalid end'
): EndsWithValidation<TInput, TRequirement> {
  return {
    type: 'ends_with',
    async: false,
    message,
    requirement,
    _parse(input) {
      return !input.endsWith(this.requirement)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
