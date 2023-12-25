import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * EAN validation type.
 */
export type EanValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'ean';
  /**
   * The EAN validation function.
   */
  requirement: (input: TInput) => boolean;
};

/**
 * Creates a pipeline validation action that validates a [EAN](https://en.wikipedia.org/wiki/International_Article_Number).
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function ean<TInput extends string>(
  message: ErrorMessage = 'Invalid EAN code.'
): EanValidation<TInput> {
  return {
    type: 'ean',
    async: false,
    message,
    requirement: isEAN,
    _parse(input) {
      return !this.requirement(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}

const EAN_LENGTH_REGEX = /^\d{8}$|^\d{13}$|^\d{14}$/u;

/**
 * Checks whether a string is EAN code.
 *
 * @param input input to be checked
 *
 * @returns boolan true if input string is valid ean string, false otherwise
 */
function isEAN(input: string): boolean {

  if (!EAN_LENGTH_REGEX.test(input)) {
    return false;
  }

  const isEAN14 = input.length === 14;
  const isEAN8 = input.length === 8;
  const checksumDigit = parseInt(input.slice(-1));
  const calculateWeightedSum = (acc: number, digit: string, index: number) => {
    const weight = isEAN14 || isEAN8 ? (index % 2 === 0 ? 3 : 1) : (index % 2 === 0 ? 1 : 3);
    return acc + parseInt(digit) * weight;
  };

  const sum = input.slice(0, -1).split('').reduce(calculateWeightedSum, 0);
  const calculatedChecksum = (10 - (sum % 10)) % 10;

  return calculatedChecksum === checksumDigit;
}
