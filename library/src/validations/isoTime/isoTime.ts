import type { PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates a time.
 *
 * Format: hh:mm
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoTime<TInput extends string>(error?: string) {
  return (input: TInput): PipeResult<TInput> => {
    if (!/^(0[0-9]|1\d|2[0-3]):[0-5]\d$/.test(input)) {
      return {
        issue: {
          validation: 'iso_time',
          message: error || 'Invalid time',
          input,
        },
      };
    }
    return { output: input };
  };
}
