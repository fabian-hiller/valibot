import { MAC64_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * MAC validation type.
 */
export type Mac64Validation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'mac64';
  /**
   * The 64 bit MAC regex.
   */
  requirement: RegExp;
};

/**
 * Creates a validation function that validates a 64 bit [MAC](https://en.wikipedia.org/wiki/MAC_address).
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function mac64<TInput extends string>(
  message: ErrorMessage = 'Invalid MAC 64 bit Address'
): Mac64Validation<TInput> {
  return {
    type: 'mac64',
    async: false,
    message,
    requirement: MAC64_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
