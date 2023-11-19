import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Ends with validation type.
 */
export type EndsWithValidation<
  TInput extends string,
  TRequirement extends string
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
 * Creates a validation function that validates the end of a string.
 *
 * @param requirement The end string.
 * @param message The error message.
 *
 * @returns A validation function.
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
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
