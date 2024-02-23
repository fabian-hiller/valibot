import { EMAIL_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

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
 * Creates a pipeline validation action that validates an email.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function email<TInput extends string>(
  message?: ErrorMessage
): EmailValidation<TInput> {
  return {
    type: 'email',
    expects: null,
    async: false,
    message,
    requirement: EMAIL_REGEX,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, email, input, 'email');
    },
  };
}
