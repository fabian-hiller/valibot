import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';
import { isISIN } from '../../utils/isISIN/index.ts';

/**
 * ISIN (International Securities Identification Number) validation type.
 */
export type IsinValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'isin';
  /**
   * The isISIN validation util function.
   */
  requirement: typeof isISIN;
};

/**
 * Creates a validation function that validates an [ISIN](https://en.wikipedia.org/wiki/International_Securities_Identification_Number).
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function isin<TInput extends string>(
  message: ErrorMessage = 'Invalid ISIN'
): IsinValidation<TInput> {
  return {
    type: 'isin',
    async: false,
    message,
    requirement: isISIN,
    _parse(input) {
      return !this.requirement(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
