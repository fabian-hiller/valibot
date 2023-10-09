import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the length of a string or array.
 *
 * @param requirement The minimum length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minLength<TInput extends string | any[]>(
  requirement: number,
  error?: ErrorMessage
) {
  return (input: TInput): PipeResult<TInput> =>
    input.length < requirement
      ? getPipeIssues('min_length', error || 'Invalid length', input)
      : getOutput(input);
}
