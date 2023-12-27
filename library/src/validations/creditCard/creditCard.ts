import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput, isLuhnAlgo } from '../../utils/index.ts';

/**
 * Credit card validation type.
 */
export type CreditCardValidation<TInput extends string> =
  BaseValidation<TInput> & {
    /**
     * The validation type.
     */
    type: 'credit_card';
    /**
     * The validation function.
     */
    requirement: (input: string) => boolean;
  };

/**
 * Sanitize regex.
 */
const SANITIZE_REGEX = /[- ]+/gu;

/**
 * Provider regex list.
 */
const PROVIDER_REGEX_LIST = [
  // American Express
  /^3[47]\d{13}$/u,
  // Diners Club
  /^3(?:0[0-5]|[68]\d)\d{11}$/u,
  // Discover
  /^6(?:011|5\d{2})\d{12,15}$/u,
  // JCB
  /^(?:2131|1800|35\d{3})\d{11}$/u,
  // Mastercard
  /^5[1-5]\d{2}|(222\d|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)\d{12}$/u,
  // UnionPay
  /^(6[27]\d{14}|81\d{14,17})$/u,
  // Visa
  /^4\d{12}(?:\d{3,6})?$/u,
  // Elo
  /^(4011(78|79)|43(1274|8935)|45(1416|7393|763(1|2))|50(4175|6699|67[0-7]\d|9000)|627780|63(6297|6368)|650(03([^4])|04(\d)|05(0|1)|4(0[5-9]|3\d|8[5-9]|9\d)|5([0-2]\d|3[0-8])|9([2-6]\d|7[0-8])|541|700|720|901)|651652|655000|655021)/u,
];

/**
 * Creates a pipeline validation action that validates a [credit card](https://en.wikipedia.org/wiki/Payment_card_number).
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function creditCard<TInput extends string>(
  message: ErrorMessage = 'Invalid credit card'
): CreditCardValidation<TInput> {
  return {
    type: 'credit_card',
    async: false,
    message,
    requirement: (input) => {
      // Remove any hyphens and blanks
      const sanitized = input.replace(SANITIZE_REGEX, '');

      // Check if it matches a provider and passes luhn algorithm
      return (
        PROVIDER_REGEX_LIST.some((regex) => regex.test(sanitized)) &&
        isLuhnAlgo(sanitized)
      );
    },
    _parse(input) {
      return !this.requirement(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
