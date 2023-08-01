import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation functions that validates a imei.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function imei<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (!isValidImei(input)) {
      throw new ValiError([
        {
          validation: 'imei',
          origin: 'value',
          message: error || 'Invalid imei',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}

function isValidImei(imei: string): boolean {

  if (imei.length !== 15) {
    return false
  }
  const checkDigit = +imei[14]
  if (isNaN(checkDigit)) {
    return false
  }
  const restDigits = imei.slice(0, 14).split('').map(v => +v)
  if (restDigits.some(v => isNaN(v))) {
    return false
  }
  const everySecondDigitDoubled = restDigits.map((v, i) => i % 2 ? v * 2 : v)
  const everyDoubledNumberSplitted = everySecondDigitDoubled.join('').split('').map(v => +v)
  const sum = everyDoubledNumberSplitted.reduce((a, b) => a + b, 0)
  const calculatedCheckDigit = (10 - (sum % 10)) % 10
  return checkDigit === calculatedCheckDigit
}
