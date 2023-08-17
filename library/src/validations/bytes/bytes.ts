import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getLeafIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates the byte length of a string.
 *
 * @param requirement The byte length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function bytes<TInput extends string>(
  requirement: number,
  error?: string
) {
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    if (new TextEncoder().encode(input).length !== requirement) {
      return {
        issues: [
          getLeafIssue(
            {
              validation: 'bytes',
              message: error || 'Invalid byte length',
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
