import { ValiError } from '../error';
import type { ValidateInfo } from '../types';

/**
 * Creates a validation functions that validates a time with seconds.
 *
 * Format: hh:mm:ss
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoTimeSeconds<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (!/^(1\d|0[1-9]|2[0-3]):[0-5]\d:[0-5]\d$/.test(input)) {
      throw new ValiError([
        {
          validation: 'iso_time_seconds',
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
