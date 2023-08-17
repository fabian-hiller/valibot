import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getLeafIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a email.
 *
 * Hint: The regex used is not perfect, but should work for most emails.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function email<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    if (
      !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
        input
      )
    ) {
      return {
        issues: [
          getLeafIssue(
            {
              validation: 'email',
              message: error || 'Invalid email',
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
