/**
 * IBAN lengths for each country mapped to country code
 */
const COUNTRY_CODE_IBAN_LENGTHS: Record<string, number> = {
  AD: 24,
  AE: 23,
  AT: 20,
  AZ: 28,
  BA: 20,
  BE: 16,
  BG: 22,
  BH: 22,
  BR: 29,
  CH: 21,
  CR: 21,
  CY: 28,
  CZ: 24,
  DE: 22,
  DK: 18,
  DO: 28,
  EE: 20,
  ES: 24,
  FI: 18,
  FO: 18,
  FR: 27,
  GB: 22,
  GI: 23,
  GL: 18,
  GR: 27,
  GT: 28,
  HR: 21,
  HU: 28,
  IE: 22,
  IL: 23,
  IS: 26,
  IT: 27,
  JO: 30,
  KW: 30,
  KZ: 20,
  LB: 28,
  LI: 21,
  LT: 20,
  LU: 20,
  LV: 21,
  MC: 27,
  MD: 24,
  ME: 22,
  MK: 19,
  MR: 27,
  MT: 31,
  MU: 30,
  NL: 18,
  NO: 15,
  PK: 24,
  PL: 28,
  PS: 29,
  PT: 25,
  QA: 29,
  RO: 24,
  RS: 22,
  SA: 24,
  SE: 24,
  SI: 19,
  SK: 24,
  SM: 27,
  TN: 24,
  TR: 26,
};

/**
 * Upper case letter regex.
 */
const UPPERCASE_LETTER_REGEX = /[A-Z]/gu;

/**
 * Checks whether a string with numbers corresponds to valid IBAN number.
 *
 * @param input The input to be checked.
 *
 * @returns Whether input is valid.
 */
export function isIBAN(input: string) {
  const countryCode = input.slice(0, 2);
  if (COUNTRY_CODE_IBAN_LENGTHS[countryCode] !== input.length) {
    return false;
  }

  const rearranged = input.slice(4) + countryCode + input.slice(2, 4);
  const numbers = rearranged.replace(UPPERCASE_LETTER_REGEX, (char) =>
    (char.charCodeAt(0) - 55).toString()
  );

  return mod97(numbers) === 1;
}

/**
 * Calculate modul 97 on input string
 *
 * @param input string of numbers
 *
 * @returns checksum
 */
function mod97(input: string): number {
  let checksum = 0;
  for (let i = 0; i < input.length; i++) {
    checksum = (checksum * 10 + parseInt(input[i], 10)) % 97;
  }
  return checksum;
}
