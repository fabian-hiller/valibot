import { ValiError } from '../error';
import type { ValidateInfo } from '../types';

/**
 * Creates a validation functions that validates a time.
 *
 * Format: hh:mm
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoTime<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (!/^(0[1-9]|1\d|2[0-3]):[0-5]\d$/.test(input)) {
      throw new ValiError([
        {
          validation: 'iso_time',
          origin: 'value',
          message: error || 'Invalid time',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
