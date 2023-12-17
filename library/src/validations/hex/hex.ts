import { HEX_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Hexadecimal validation type.
 */
export type HexValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'hex';
  /**
   * The validation function.
   */
  requirement: RegExp;
};

/**
 * Creates a validation function that validates if string is hexadecimal.
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function hex<TInput extends string>(
  message: ErrorMessage = 'Invalid hexadecimal string'
): HexValidation<TInput> {
  return {
    type: 'hex',
    async: false,
    message,
    requirement: HEX_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
