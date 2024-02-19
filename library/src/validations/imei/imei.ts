import { IMEI_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput, isLuhnAlgo } from '../../utils/index.ts';

/**
 * IMEI validation type.
 */
export type ImeiValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'imei';
  /**
   * The IMEI regex and luhn algorithm.
   */
  requirement: [RegExp, typeof isLuhnAlgo];
};

/**
 * Creates a pipeline validation action that validates an [IMEI](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity).
 *
 * Format: AA-BBBBBB-CCCCCC-D
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function imei<TInput extends string>(
  message?: ErrorMessage
): ImeiValidation<TInput> {
  return {
    type: 'imei',
    expects: null,
    async: false,
    message,
    requirement: [IMEI_REGEX, isLuhnAlgo],
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement[0].test(input) && this.requirement[1](input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, imei, input, 'IMEI');
    },
  };
}
