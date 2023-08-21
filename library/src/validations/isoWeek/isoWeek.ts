import type { PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates a week.
 *
 * Format: yyyy-Www
 *
 * Hint: The regex used cannot validate the maximum number of weeks based on
 * the year. For example, "2021W53" is valid even though the year 2021 has only
 * 52 weeks.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoWeek<TInput extends string>(error?: string) {
  return (input: TInput): PipeResult<TInput> => {
    if (!/^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/.test(input)) {
      return {
        issue: {
          validation: 'iso_week',
          message: error || 'Invalid week',
          input,
        },
      };
    }
    return { output: input };
  };
}
