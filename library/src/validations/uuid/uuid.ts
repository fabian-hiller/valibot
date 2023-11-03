import { UUID_REGEX } from '../../regex.ts';
import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier).
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function uuid<TInput extends string>(error?: ErrorMessage) {
  return (input: TInput): PipeResult<TInput> =>
    !UUID_REGEX.test(input)
      ? getPipeIssues('uuid', error || 'Invalid UUID', input)
      : getOutput(input);
}
