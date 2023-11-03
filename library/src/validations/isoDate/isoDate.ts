import { ISO_DATE_REGEX } from '../../regex.ts';
import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates a date.
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
export function isoDate<TInput extends string>(error?: ErrorMessage) {
  return (input: TInput): PipeResult<TInput> =>
    !ISO_DATE_REGEX.test(input)
      ? getPipeIssues('iso_date', error || 'Invalid date', input)
      : getOutput(input);
}
