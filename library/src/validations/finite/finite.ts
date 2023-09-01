import type { FString, PipeResult } from '../../types.ts';

/**
 * Creates a validation function that validates whether a number is finite.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function finite<TInput extends number>(error?: FString) {
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
    return { output: input };
  };
}
