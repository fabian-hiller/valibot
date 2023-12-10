import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';
import { isCreditCard } from '../../utils/isCreditCard/isCreditCard.ts';

/**
 * Credit Card validation type.
 */
export type CreditCardValidation<TInput extends string> =
  BaseValidation<TInput> & {
    /**
     * The validation type.
     */
    type: 'creditCard';
    /**
     * The isCreditCard method
     */
    requirement: typeof isCreditCard;
  };

/**
 * Creates a validation function that validates a [Credit Card](https://en.wikipedia.org/wiki/Payment_card_number).
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function creditCard<TInput extends string>(
  message: ErrorMessage = 'Invalid Credit Card'
): CreditCardValidation<TInput> {
  return {
    type: 'creditCard',
    async: false,
    message,
    requirement: isCreditCard,
    _parse(input) {
      return !this.requirement(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
