import { CUID2_REGEX } from '../../regex.ts';
import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates a [cuid2](https://github.com/paralleldrive/cuid2#cuid2).
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function cuid2<TInput extends string>(error?: ErrorMessage) {
  return (input: TInput): PipeResult<TInput> =>
    !CUID2_REGEX.test(input)
      ? getPipeIssues('cuid2', error || 'Invalid cuid2', input)
      : getOutput(input);
}
