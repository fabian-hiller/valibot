import { MAC48_REGEX, MAC64_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * MAC validation type.
 */
export type MacValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'mac';
  /**
   * The 48-bit and 64-bit MAC regex.
   */
  requirement: [RegExp, RegExp];
};

/**
 * Creates a pipeline validation action that validates a [MAC address](https://en.wikipedia.org/wiki/MAC_address).
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function mac<TInput extends string>(
  message: ErrorMessage = 'Invalid MAC'
): MacValidation<TInput> {
  return {
    type: 'mac',
    async: false,
    message,
    requirement: [MAC48_REGEX, MAC64_REGEX],
    _parse(input) {
      return !this.requirement[0].test(input) &&
        !this.requirement[1].test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
