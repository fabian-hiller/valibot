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
  return (input: TInput): PipeResult<TInput> =>
    !/^(?:0\d|1\d|2[0-3])(?::[0-5]\d){2}$/u.test(input)
      ? getPipeIssues('iso_time_second', error || 'Invalid time', input)
      : getOutput(input);
}
