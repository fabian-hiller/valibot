import type { FString, PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates the start of a string.
 *
 * @param requirement The start string.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function startsWith<TInput extends string>(
  requirement: string,
  error?: FString
) {
  return (input: TInput): PipeResult<TInput> => {
    if (!input.startsWith(requirement as any)) {
      return {
        issue: {
          validation: 'starts_with',
          message: error || 'Invalid start',
          input,
        },
      };
    }
    return { output: input };
  };
}
