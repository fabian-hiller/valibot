import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates an date.
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
  return {
    kind: 'iso_date' as const,
    message: error ?? 'Invalid date',
    requirement: /^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])$/,
    _parse(input: TInput): PipeResult<TInput> {
      return !this.requirement.test(input)
        ? getPipeIssues(this.kind, this.message, input)
        : getOutput(input);
    },
  };
}
