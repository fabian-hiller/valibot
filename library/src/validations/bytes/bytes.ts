import type { FString, PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates the byte length of a string.
 *
 * @param requirement The byte length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function bytes<TInput extends string>(
  requirement: number,
  error?: FString
) {
  return (input: TInput): PipeResult<TInput> => {
    if (new TextEncoder().encode(input).length !== requirement) {
      return {
        issue: {
          validation: 'bytes',
          message: error || 'Invalid byte length',
          input,
        },
      };
    }
    return { output: input };
  };
}
