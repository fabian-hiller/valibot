import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is a safe integer.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function safeInteger<TInput extends number>(error?: ErrorMessage) {
  return {
    type: 'safe_integer' as const,
    message: error ?? 'Invalid safe integer',
    _parse(input: TInput): PipeResult<TInput> {
      return !Number.isSafeInteger(input)
        ? getPipeIssues(this.type, this.message, input)
        : getOutput(input);
    },
  };
}
