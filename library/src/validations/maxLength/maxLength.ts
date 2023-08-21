import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates the length of a string or array.
 *
 * @param requirement The maximum length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxLength<TInput extends string | any[]>(
  requirement: number,
  error?: string
) {
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    if (input.length > requirement) {
      return {
        issues: [
          getIssue(info, {
            validation: 'max_length',
            message: error || 'Invalid length',
            input,
          }),
        ],
      };
    }
    return { output: input };
  };
}
