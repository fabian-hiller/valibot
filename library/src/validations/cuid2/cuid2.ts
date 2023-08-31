import type { PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates a [cuid2](https://github.com/paralleldrive/cuid2#cuid2).
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function cuid2<TInput extends string>(error?: string) {
  return (input: TInput): PipeResult<TInput> => {
    if (
      !/^[a-z][a-z\d]*$/.test(
        input
      )
    ) {
      return {
        issue: {
          validation: 'cuid2',
          message: error || 'Invalid cuid2',
          input,
        },
      };
    }
    return { output: input };
  };
}
