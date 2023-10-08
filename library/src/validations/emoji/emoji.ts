import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates an emoji.
 * @param error The error message.
 * @returns A validation function.
 */
export function emoji<TInput extends string>(error?: ErrorMessage) {
  return (input: TInput): PipeResult<TInput> =>
    !/^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u.test(input)
      ? getPipeIssues('emoji', error || 'Invalid emoji', input)
      : getOutput(input);
}
