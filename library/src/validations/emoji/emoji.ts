import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getLeafIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a emoji.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function emoji<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    if (!/^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u.test(input)) {
      return {
        issues: [
          getLeafIssue(
            {
              validation: 'emoji',
              message: error || 'Invalid emoji',
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
