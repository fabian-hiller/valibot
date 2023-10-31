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
  return {
    type: 'iso_timestamp' as const,
    message: error ?? 'Invalid timestamp',
    requirement: ISO_TIMESTAMP_REGEX,
    _parse(input: TInput): PipeResult<TInput> {
      return !this.requirement.test(input)
        ? getPipeIssues(this.type, this.message, input)
        : getOutput(input);
    },
  };
}
