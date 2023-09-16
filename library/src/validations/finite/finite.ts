import type { PipeResult } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is finite.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function finite<TInput extends number>(error?: string) {
  return (input: TInput): PipeResult<TInput> => {
    if (!Number.isFinite(input)) {
      return {
        issue: {
          validation: 'finite',
          message: error || 'Invalid finite number',
          input,
        },
      };
    }
    return getOutput(input);
  };
}
