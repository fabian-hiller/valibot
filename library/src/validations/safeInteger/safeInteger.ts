import type { PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is a safe integer.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function safeInteger<TInput extends number>(error?: string) {
  return (input: TInput): PipeResult<TInput> =>
    !Number.isSafeInteger(input)
      ? getPipeIssues('safe_integer', error || 'Invalid safe integer', input)
      : getOutput(input);
}
