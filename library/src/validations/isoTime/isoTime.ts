import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates a time.
 *
 * Format: hh:mm
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoTime<TInput extends string>(error?: ErrorMessage) {
  return {
    kind: 'iso_time' as const,
    message: error ?? 'Invalid time',
    requirement: /^(0[0-9]|1\d|2[0-3]):[0-5]\d$/,
    _parse(input: TInput): PipeResult<TInput> {
      return !this.requirement.test(input)
        ? getPipeIssues(this.kind, this.message, input)
        : getOutput(input);
    },
  };
}
