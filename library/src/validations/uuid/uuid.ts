import type { PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates a UUID.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function uuid<TInput extends string>(error?: string) {
  return (input: TInput): PipeResult<TInput> => {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        input
      )
    ) {
      return {
        issue: {
          validation: 'uuid',
          message: error || 'Invalid UUID',
          input,
        },
      };
    }
    return { output: input };
  };
}
