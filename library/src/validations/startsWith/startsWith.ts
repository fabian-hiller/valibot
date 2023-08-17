import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getLeafIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates the start of a string.
 *
 * @param requirement The start string.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function startsWith<TInput extends string>(
  requirement: string,
  error?: string
) {
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    if (!input.startsWith(requirement as any)) {
      return {
        issues: [
          getLeafIssue(
            {
              validation: 'starts_with',
              message: error || 'Invalid start',
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
