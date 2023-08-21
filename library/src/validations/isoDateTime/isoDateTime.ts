import type { PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates a datetime.
 *
 * Format: yyyy-mm-ddThh:mm
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31T00:00" is valid although June has only
 * 30 days.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoDateTime<TInput extends string>(error?: string) {
  return (input: TInput): PipeResult<TInput> => {
    if (
      !/^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])T(0[0-9]|1\d|2[0-3]):[0-5]\d$/.test(
        input
      )
    ) {
      return {
        issue: {
          validation: 'iso_date_time',
          message: error || 'Invalid datetime',
          input,
        },
      };
    }
    return { output: input };
  };
}
