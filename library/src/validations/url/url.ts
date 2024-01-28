import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * URL validation type.
 */
export type UrlValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'url';
  /**
   * The validation function.
   */
  requirement: (input: TInput) => boolean;
};

/**
 * Creates a pipeline validation action that validates a URL.
 *
 * Hint: The value is passed to the URL constructor to check if it is valid.
 * This check is not perfect. For example, values like "abc:1234" are accepted.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function url<TInput extends string>(
  message?: ErrorMessage
): UrlValidation<TInput> {
  return {
    type: 'url',
    expects: null,
    async: false,
    message,
    requirement(input) {
      try {
        new URL(input);
        return true;
      } catch {
        return false;
      }
    },
    _parse(input) {
      if (this.requirement(input)) {
        return actionOutput(input);
      }
      return actionIssue(this, input, 'URL');
    },
  };
}
