import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is an integer.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function integer<TInput extends number>(error?: ErrorMessage) {
  return {
    type: 'integer' as const,
    message: error ?? 'Invalid integer',
    _parse(input: TInput): PipeResult<TInput> {
      return !Number.isInteger(input)
        ? getPipeIssues(this.type, this.message, input)
        : getOutput(input);
    },
  };
}
