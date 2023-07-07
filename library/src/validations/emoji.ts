import { ValiError } from '../error';
import type { ValidateInfo } from '../types';

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
        {
          validation: 'emoji',
          origin: 'value',
          message: error || 'Invalid emoji',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
