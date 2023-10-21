/**
 * Non-digit regex.
 */
const NON_DIGIT_REGEX = /\D/gu;

/**
 * Checks whether a string with numbers corresponds to the luhn algorithm.
 *
 * @param input The input to be checked.
 *
 * @returns Whether input is valid.
 */
export function isLuhnAlgo(input: string) {
  // Remove any non-digit chars
  const number = input.replaceAll(NON_DIGIT_REGEX, '');

  // Create necessary variables
  let length = number.length;
  let bit = 1;
  let sum = 0;

  // Calculate sum of algorithm
  while (length) {
    const value = +number[--length];
    bit ^= 1;
    sum += bit ? [0, 2, 4, 6, 8, 1, 3, 5, 7, 9][value] : value;
  }

  // Return whether its valid
  return sum % 10 === 0;
}
