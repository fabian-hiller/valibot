import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a emoji.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function emoji<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (!/^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u.test(input)) {
      throw new ValiError([
        getIssue(info, {
          validation: 'emoji',
          message: error || 'Invalid emoji',
          input,
        }),
      ]);
    }
    return input;
  };
}
