import { EMOJI_REGEX } from '../../regex.ts';
import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates an emoji.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function emoji<TInput extends string>(error?: ErrorMessage) {
  return {
    type: 'emoji' as const,
    message: error ?? 'Invalid emoji',
    requirement: EMOJI_REGEX,
    _parse(input: TInput): PipeResult<TInput> {
      return !this.requirement.test(input)
        ? getPipeIssues(this.type, this.message, input)
        : getOutput(input);
    },
  };
}
