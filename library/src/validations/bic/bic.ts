import { BIC_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Bic validation type.
 */
export type BicValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'bic';
  /**
   * The BIC regex.
   */
  requirement: RegExp;
};

/**
 * Creates a validation function that validates a [BIC](https://en.wikipedia.org/wiki/Universally_unique_identifier).
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function bic<TInput extends string>(
  message: ErrorMessage = 'Invalid BIC code.'
): BicValidation<TInput> {
  return {
    type: 'bic',
    async: false,
    message,
    requirement: BIC_REGEX,
    _parse(input) {
      return !this.requirement.test(input.toUpperCase())
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
