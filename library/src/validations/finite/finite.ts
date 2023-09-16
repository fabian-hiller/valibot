import type { PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is finite.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function finite<TInput extends number>(error?: string) {
  return (input: TInput): PipeResult<TInput> =>
    !Number.isFinite(input)
      ? getPipeIssues('finite', error || 'Invalid finite number', input)
      : getOutput(input);
}
