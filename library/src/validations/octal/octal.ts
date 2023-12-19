import { OCTAL_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Octal validation type.
 */
export type OctalValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'octal';
  /**
   * The Octal regex.
   */
  requirement: RegExp;
};

/**
 * Creates a validation function that validates an [OCTAL](https://en.wikipedia.org/wiki/Octal) string.
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function octal<TInput extends string>(
  message: ErrorMessage = 'Invalid octal'
): OctalValidation<TInput> {
  return {
    type: 'octal',
    async: false,
    message,
    requirement: OCTAL_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
