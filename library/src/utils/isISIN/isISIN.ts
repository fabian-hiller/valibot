import { isLuhnAlgo } from '../isLuhnAlgo/index.ts';

const REGEX_ISIN = /^[A-Z]{2}[A-Z\d]{9}\d$/iu;

/**
 * Checks whether input is an valid ISIN (International Securities Identification Number)
 *
 * @param input The input to be checked.
 *
 * @returns Whether input is valid.
 */
export function isISIN(input: string) {
  if (!REGEX_ISIN.test(input)) {
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
