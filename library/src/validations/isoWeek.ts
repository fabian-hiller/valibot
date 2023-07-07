import { ValiError } from '../error';
import type { ValidateInfo } from '../types';

/**
 * Creates a validation functions that validates a week.
 *
 * Format: yyyy-Www
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoWeek<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (!/^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/.test(input)) {
      throw new ValiError([
        {
          validation: 'iso_week',
          origin: 'value',
          message: error || 'Invalid week',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
