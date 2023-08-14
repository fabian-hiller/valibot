import type { ParseResult, ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates the length of a string or array.
 *
 * @param requirement The minimum length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minLength<TInput extends string | any[]>(
  requirement: number,
  error?: string
) {
  return (input: TInput, info: ValidateInfo): ParseResult<TInput> => {
    if (input.length < requirement) {
      return {
        issues: [
          getIssue(info, {
            validation: 'min_length',
            message: error || 'Invalid length',
            input,
          }),
        ],
      };
    }
    return { output: input };
  };
}
