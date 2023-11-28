import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

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
  type: 'stars_with';
  /**
   * The start string.
   */
  requirement: TRequirement;
};

/**
 * Creates a validation function that validates the start of a string.
 *
 * @param requirement The start string.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function startsWith<TInput extends string, TRequirement extends string>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid start'
): StartsWithValidation<TInput, TRequirement> {
  return {
    type: 'stars_with',
    async: false,
    message,
    requirement,
    _parse(input) {
      return !input.startsWith(this.requirement)
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
