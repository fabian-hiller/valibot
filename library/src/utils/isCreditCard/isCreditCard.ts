import { isLuhnAlgo } from '../isLuhnAlgo/index.ts';

const CREDIT_CARDS: Record<string, RegExp> = {
  amex: /^3[47]\d{13}$/u,
  dinersclub: /^3(?:0[0-5]|[68]\d)\d{11}$/u,
  discover: /^6(?:011|5\d{2})\d{12,15}$/u,
  jcb: /^(?:2131|1800|35\d{3})\d{11}$/u,
  mastercard:
    /^5[1-5]\d{2}|(222\d|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)\d{12}$/u,
  unionpay: /^(6[27]\d{14}|(81\d{14,17}))$/u,
  visa: /^(4\d{12})(?:\d{3,6})?$/u,
};

/**
 * Returns true if credit card number is valid
 *
 * @param cardNumber The card number.
 *
 * @returns boolean true if card is valid.
 */
export function isCreditCard(cardNumber: string): boolean {
  const sanitizedCardNumber = cardNumber.replace(/[- ]+/gu, '');
  const cards = Object.entries(CREDIT_CARDS);

  if (
    !cards.some((cardProvider) => cardProvider[1].test(sanitizedCardNumber))
  ) {
    return false;
  }
  return isLuhnAlgo(sanitizedCardNumber);
}
