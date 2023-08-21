import type { PipeResult } from '../../types.ts';

/**
 * Creates a validation function that validates whether a number is a multiple.
 *
 * @param requirement The divisor.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function multipleOf<TInput extends number>(
  requirement: number,
  error?: string
) {
  return (input: TInput): PipeResult<TInput> => {
    if (input % requirement !== 0) {
      return {
        issue: {
          validation: 'multipleOf',
          message: error || 'Invalid multiple',
          input,
        },
      };
    }
    return { output: input };
  };
}
