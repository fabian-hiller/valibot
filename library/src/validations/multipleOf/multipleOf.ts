import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getLeafIssue } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is a multiple.
 *
 * @param requirement The divisor.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function multipleOf<TInput extends number>(
  requirement: number,
  error?: string
) {
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    if (input % requirement !== 0) {
      return {
        issues: [
          getLeafIssue(
            {
              validation: 'multipleOf',
              message: error || 'Invalid multiple',
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
