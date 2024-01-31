import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

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
 * Creates a pipeline validation action that validates a string with a regex.
 *
 * @param requirement The regex pattern.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function regex<TInput extends string>(
  requirement: RegExp,
  message?: ErrorMessage
): RegexValidation<TInput> {
  return {
    type: 'regex',
    expects: `${requirement}`,
    async: false,
    message,
    requirement,
    _parse(input) {
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }
      return actionIssue(this, regex, input, 'format');
    },
  };
}
