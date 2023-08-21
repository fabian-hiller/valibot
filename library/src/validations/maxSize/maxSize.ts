import type { PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates the size of a map, set or blob.
 *
 * @param requirement The maximum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxSize<TInput extends Map<any, any> | Set<any> | Blob>(
  requirement: number,
  error?: string
) {
  return (input: TInput): PipeResult<TInput> => {
    if (input.size > requirement) {
      return {
        issue: {
          validation: 'max_size',
          message: error || 'Invalid size',
          input,
        },
      };
    }
    return { output: input };
  };
}
