import type { PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is a multiple.
 *
 * @param requirement The divisor.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function multipleOf<TInput extends number>(
  requirement: number,
  error?: string
) {
  return (input: TInput): PipeResult<TInput> =>
    input % requirement !== 0
      ? getPipeIssues('multiple_of', error || 'Invalid multiple', input)
      : getOutput(input);
}
