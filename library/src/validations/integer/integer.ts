import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is an integer.
 * @param error The error message.
 * @returns A validation function.
 */
export function integer<TInput extends number>(error?: ErrorMessage) {
  return (input: TInput): PipeResult<TInput> =>
    !Number.isInteger(input)
      ? getPipeIssues('integer', error || 'Invalid integer', input)
      : getOutput(input);
}
