import { MAC48_REGEX, MAC64_REGEX } from '../../regex.ts';
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
   * The MAC 48 and 64 bit regex.
   */
  requirement: [RegExp, RegExp];
};

/**
 * Creates a validation function that validates a [MAC address](https://en.wikipedia.org/wiki/MAC_address).
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function mac<TInput extends string>(
  message: ErrorMessage = 'Invalid MAC address'
): MacValidation<TInput> {
  return {
    type: 'mac',
    async: false,
    message,
    requirement: [MAC48_REGEX, MAC64_REGEX],
    _parse(input) {
      return !this.requirement[0].test(input) &&
        !this.requirement[1].test(input)
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
