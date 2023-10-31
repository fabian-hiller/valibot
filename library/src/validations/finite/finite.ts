import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is finite.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function finite<TInput extends number>(error?: ErrorMessage) {
  return {
    type: 'finite' as const,
    message: error ?? 'Invalid finite number',
    _parse(input: TInput): PipeResult<TInput> {
      return !Number.isFinite(input)
        ? getPipeIssues(this.type, this.message, input)
        : getOutput(input);
    },
  };
}
