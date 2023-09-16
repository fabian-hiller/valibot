import type { PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates the end of a string.
 *
 * @param requirement The end string.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function endsWith<TInput extends string>(
  requirement: string,
  error?: string
) {
  return (input: TInput): PipeResult<TInput> =>
    !input.endsWith(requirement as any)
      ? getPipeIssues('ends_with', error || 'Invalid end', input)
      : getOutput(input);
}
