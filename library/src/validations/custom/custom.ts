import type { PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a custom validation function.
 *
 * @param requirement The validation function.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function custom<TInput>(
  requirement: (input: TInput) => boolean,
  error?: string
) {
  return (input: TInput): PipeResult<TInput> =>
    !requirement(input)
      ? getPipeIssues('custom', error || 'Invalid input', input)
      : getOutput(input);
}
