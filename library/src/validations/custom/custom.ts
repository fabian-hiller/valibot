import type { PipeResult } from '../../types.ts';

/**
 * Creates a custom validation function.
 *
 * @param requirement The validation function.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function custom<TInput>(
  requirement: (input: TInput) => boolean,
  error?: string
) {
  return (input: TInput): PipeResult<TInput> => {
    if (!requirement(input)) {
      return {
        issue: {
          validation: 'custom',
          message: error || 'Invalid input',
          input,
        },
      };
    }
    return { output: input };
  };
}
