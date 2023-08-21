import type { PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates a date.
 *
 * Format: yyyy-mm-dd
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31" is valid although June has only
 * 30 days.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoDate<TInput extends string>(error?: string) {
  return (input: TInput): PipeResult<TInput> => {
    if (!/^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])$/.test(input)) {
      return {
        issue: {
          validation: 'iso_date',
          message: error || 'Invalid date',
          input,
        },
      };
    }
    return { output: input };
  };
}
