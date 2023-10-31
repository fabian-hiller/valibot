import { ISO_TIME_SECOND_REGEX } from '../../regex.ts';
import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates a time with seconds.
 *
 * Format: hh:mm:ss
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoTimeSecond<TInput extends string>(error?: ErrorMessage) {
  return {
    type: 'iso_time_second' as const,
    message: error ?? 'Invalid time',
    requirement: ISO_TIME_SECOND_REGEX,
    _parse(input: TInput): PipeResult<TInput> {
      return !this.requirement.test(input)
        ? getPipeIssues(this.type, this.message, input)
        : getOutput(input);
    },
  };
}
