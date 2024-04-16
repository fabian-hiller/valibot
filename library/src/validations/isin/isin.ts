import { ISIN_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput, isLuhnAlgo } from '../../utils/index.ts';

/**
 * ISIN (International Securities Identification Number) validation type.
 */
export type IsinValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'isin';
  /**
   *  The validation function.
   */
  requirement: (input: TInput) => boolean;
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

/**
 * Checks whether input is an valid ISIN (International Securities Identification Number)
 *
 * @param input The input to be checked.
 *
 * @returns Whether input is valid.
 */
function isISIN(input: string) {
  if (!ISIN_REGEX.test(input)) {
    return false;
  }

  const converted = input
    .split('')
    .map((char: string) => convertLetterToNumber(char))
    .join('');

  return isLuhnAlgo(converted);
}

function convertLetterToNumber(char: string): string {
  const code = char.charCodeAt(0);
  return code >= 65 && code <= 90 // Check if character is a letter
    ? (code - 55).toString() // Convert letter to number (A=10, B=11, ..., Z=35)
    : char; // Return the character as is if it's a digit
}
