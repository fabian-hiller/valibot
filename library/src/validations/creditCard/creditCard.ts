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

export const AMERICAN_EXPRESS_REGEX = /^3[47]\d{13}$/u;
export const DINERS_CLUB_REGEX = /^3(?:0[0-5]|[68]\d)\d{11}$/u;
export const DISCOVER_REGEX = /^6(?:011|5\d{2})\d{12,15}$/u;
export const JCB_REGEX = /^(?:2131|1800|35\d{3})\d{11}$/u;
export const MASTERCARD_REGEX =
  /^5[1-5]\d{2}|(222\d|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)\d{12}$/u;
export const UNION_PAY_REGEX = /^(6[27]\d{14}|81\d{14,17})$/u;
export const VISA_REGEX = /^4\d{12}(?:\d{3,6})?$/u;
export const HIPERCARD_REGEX = /^(606282\d{10}(\d{3})?)|(3841\d{13})$/u;

/**
 * Provider regex list.
 */
const PROVIDER_REGEX_LIST = [
  AMERICAN_EXPRESS_REGEX,
  DINERS_CLUB_REGEX,
  DISCOVER_REGEX,
  JCB_REGEX,
  MASTERCARD_REGEX,
  UNION_PAY_REGEX,
  VISA_REGEX,
  HIPERCARD_REGEX,
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
