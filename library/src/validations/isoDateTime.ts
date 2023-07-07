import { ValiError } from '../error';
import type { ValidateInfo } from '../types';

/**
 * Creates a validation functions that validates a datetime.
 *
 * Format: yyyy-mm-ddThh:mm
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoDateTime<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (
      !/^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])T(1\d|0[1-9]|2[0-3]):[0-5]\d$/.test(
        input
      )
    ) {
      throw new ValiError([
        {
          validation: 'iso_date_time',
          origin: 'value',
          message: error || 'Invalid datetime',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
