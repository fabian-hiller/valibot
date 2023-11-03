import { ISO_TIMESTAMP_REGEX } from '../../regex.ts';
import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates a timestamp.
 *
 * Format: yyyy-mm-ddThh:mm:ss.sssZ
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31T00:00:00.000Z" is valid although
 * June has only 30 days.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoTimestamp<TInput extends string>(error?: ErrorMessage) {
  return (input: TInput): PipeResult<TInput> =>
    !ISO_TIMESTAMP_REGEX.test(input)
      ? getPipeIssues('iso_timestamp', error || 'Invalid timestamp', input)
      : getOutput(input);
}
