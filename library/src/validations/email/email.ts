import { EMAIL_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Email validation type.
 */
export interface EmailValidation<TInput extends string>
  extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'email';
  /**
   * The email regex.
   */
  requirement: RegExp;
}

/**
 * Creates a validation function that validates a email.
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function email<TInput extends string>(
  message: ErrorMessage = 'Invalid email'
): EmailValidation<TInput> {
  return {
    type: 'email',
    async: false,
    message,
    requirement: EMAIL_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
