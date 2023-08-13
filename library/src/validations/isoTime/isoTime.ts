import type { ParseResult, ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

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
  return (input: TInput, info: ValidateInfo): ParseResult<TInput> => {
    if (!/^(0[0-9]|1\d|2[0-3]):[0-5]\d$/.test(input)) {
      return {
        issues: [
          getIssue(info, {
            validation: 'iso_time',
            message: error || 'Invalid time',
            input,
          }),
        ],
      };
    }
    return { output: input };
  };
}
