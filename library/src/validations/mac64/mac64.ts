import { MAC64_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * 64-bit MAC validation type.
 */
export type Mac64Validation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'mac64';
  /**
   * The 64-bit MAC regex.
   */
  requirement: RegExp;
};

/**
 * Creates a pipeline validation action that validates a 64-bit [MAC address](https://en.wikipedia.org/wiki/MAC_address).
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function mac64<TInput extends string>(
  message?: ErrorMessage
): Mac64Validation<TInput> {
  return {
    type: 'mac64',
    expects: null,
    async: false,
    message,
    requirement: MAC64_REGEX,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, mac64, input, '64-bit MAC');
    },
  };
}
