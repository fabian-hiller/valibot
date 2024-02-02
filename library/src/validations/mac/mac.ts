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
  message?: ErrorMessage
): MacValidation<TInput> {
  return {
    type: 'mac',
    expects: null,
    async: false,
    message,
    // TODO: It is strange that we have an OR relationship between requirements
    requirement: [MAC48_REGEX, MAC64_REGEX],
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement[0].test(input) || this.requirement[1].test(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, mac, input, 'MAC');
    },
  };
}
