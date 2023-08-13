import type { ParseResult, ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a emoji.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function emoji<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo): ParseResult<TInput> => {
    if (!/^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u.test(input)) {
      return {
        issues: [
          getIssue(info, {
            validation: 'emoji',
            message: error || 'Invalid emoji',
            input,
          }),
        ],
      };
    }
    return { output: input };
  };
}
