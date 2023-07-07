import { ValiError } from '../error';
import type { ValidateInfo } from '../types';

/**
 * Creates a validation functions that validates a timestamp.
 *
 * Format: yyyy-mm-ddThh:mm:ss.sssZ
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoTimestamp<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (
      !/^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])T(1\d|0[1-9]|2[0-3]):[0-5]\d:[0-5]\d\.\d{3}Z$/.test(
        input
      )
    ) {
      throw new ValiError([
        {
          validation: 'iso_timestamp',
          origin: 'value',
          message: error || 'Invalid timestamp',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
