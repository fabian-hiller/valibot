import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

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
  return (input: TInput, info: ValidateInfo) => {
    if (!/^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])$/.test(input)) {
      throw new ValiError([
        getIssue(info, {
          validation: 'iso_date',
          message: error || 'Invalid date',
          input,
        }),
      ]);
    }
    return input;
  };
}
