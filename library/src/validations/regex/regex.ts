import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Regex validation type.
 */
export type RegexValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'regex';
  /**
   * The regex pattern.
   */
  requirement: RegExp;
};

/**
 * Creates a validation function that validates a string with a regex.
 *
 * @param requirement The regex pattern.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function regex<TInput extends string>(
  requirement: RegExp,
  message: ErrorMessage = 'Invalid regex'
): RegexValidation<TInput> {
  return {
    type: 'regex',
    async: false,
    message,
    requirement,
    _parse(input) {
      return !this.requirement.test(input)
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
