import type { PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

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
  return (input: TInput): PipeResult<TInput> =>
    !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
      input
    )
      ? getPipeIssues('email', error || 'Invalid email', input)
      : getOutput(input);
}
