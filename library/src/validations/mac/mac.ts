import { MAC_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * MAC validation type.
 */
export type MacValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'mac';
  /**
   * The <MAC> regex.
   */
  requirement: RegExp;
};

/**
 * Creates a validation function that validates a [MAC](https://en.wikipedia.org/wiki/MAC_address).
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function mac<TInput extends string>(
  message: ErrorMessage = 'Invalid MAC Address'
): MacValidation<TInput> {
  return {
    type: 'mac',
    async: false,
    message,
    requirement: MAC_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
