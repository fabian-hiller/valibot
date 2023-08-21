import type { PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates a emoji.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function emoji<TInput extends string>(error?: string) {
  return (input: TInput): PipeResult<TInput> => {
    if (!/^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u.test(input)) {
      return {
        issue: {
          validation: 'emoji',
          message: error || 'Invalid emoji',
          input,
        },
      };
    }
    return { output: input };
  };
}
