import type { PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates the end of a string.
 *
 * @param requirement The end string.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function endsWith<TInput extends string>(
  requirement: string,
  error?: string
) {
  return (input: TInput): PipeResult<TInput> => {
    if (!input.endsWith(requirement as any)) {
      return {
        issue: {
          validation: 'ends_with',
          message: error || 'Invalid end',
          input,
        },
      };
    }
    return { output: input };
  };
}
