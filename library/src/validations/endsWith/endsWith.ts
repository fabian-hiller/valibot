import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getLeafIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates the end of a string.
 *
 * @param requirement The end string.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function endsWith<TInput extends string>(
  requirement: string,
  error?: string
) {
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    if (!input.endsWith(requirement as any)) {
      return {
        issues: [
          getLeafIssue(
            {
              validation: 'ends_with',
              message: error || 'Invalid end',
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
