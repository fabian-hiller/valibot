import type { FString, PipeResult } from '../../types.ts';

/**
 * Creates a validation function that validates whether a number is a safe integer.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function safeInteger<TInput extends number>(error?: FString) {
  return (input: TInput): PipeResult<TInput> => {
    if (!Number.isSafeInteger(input)) {
      return {
        issue: {
          validation: 'safe_integer',
          message: error || 'Invalid safe integer',
          input,
        },
      };
    }
    return { output: input };
  };
}
