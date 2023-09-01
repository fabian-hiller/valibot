import type { FString, PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates a email.
 *
 * Hint: The regex used is not perfect, but should work for most emails.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function email<TInput extends string>(error?: FString) {
  return (input: TInput): PipeResult<TInput> => {
    if (
      !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
        input
      )
    ) {
      return {
        issue: {
          validation: 'email',
          message: error || 'Invalid email',
          input,
        },
      };
    }
    return { output: input };
  };
}
