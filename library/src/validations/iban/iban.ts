import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';
import { isIBAN } from '../../utils/isIBAN/isIBAN.ts';

/**
 * Iban validation type.
 */
export type IbanValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * Validation type.
   */
  type: 'iban';
  /**
   * IBAN validation function.
   */
  requirement: (input: string) => boolean;
};

/**
 * Creates a validation function that validates an [IBAN](https://en.wikipedia.org/wiki/International_Bank_Account_Number).
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function iban<TInput extends string>(
  message: ErrorMessage = 'Invalid IBAN'
): IbanValidation<TInput> {
  return {
    type: 'iban',
    async: false,
    message,
    requirement: isIBAN,
    _parse(input) {
      return !this.requirement(input.toUpperCase())
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
