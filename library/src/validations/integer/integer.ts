import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getLeafIssue } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is an integer.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function integer<TInput extends number>(error?: string) {
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    if (!Number.isInteger(input)) {
      return {
        issues: [
          getLeafIssue(
            {
              validation: 'integer',
              message: error || 'Invalid integer',
              input,
            },
            info
          ),
        ],
      };
    }
    return { output: input };
  };
}
