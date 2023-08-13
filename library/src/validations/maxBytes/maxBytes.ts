import type { ParseResult, ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates the byte length of a string.
 *
 * @param requirement The maximum length in byte.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxBytes<TInput extends string>(
  requirement: number,
  error?: string
) {
  return (input: TInput, info: ValidateInfo): ParseResult<TInput> => {
    if (new TextEncoder().encode(input).length > requirement) {
      return {
        issues: [
          getIssue(info, {
            validation: 'max_bytes',
            message: error || 'Invalid byte length',
            input,
          }),
        ],
      };
    }
    return { output: input };
  };
}
