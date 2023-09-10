import type { PipeResult } from '../../types';

/**
 * Creates a validation functions that validates a ULID.
 *
 * @link https://github.com/ulid/spec
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function ulid<TInput extends string>(error?: string) {
  return (input: TInput): PipeResult<TInput> => {
    if (!/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i.test(input)) {
      return {
        issue: {
          validation: 'ulid',
          message: error || 'Invalid ULID',
          input,
        },
      };
    }
    return { output: input };
  };
}
