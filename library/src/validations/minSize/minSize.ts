import type { FString, PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates the size of a map, set or blob.
 *
 * @param requirement The minimum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minSize<TInput extends Map<any, any> | Set<any> | Blob>(
  requirement: number,
  error?: FString
) {
  return (input: TInput): PipeResult<TInput> => {
    if (input.size < requirement) {
      return {
        issue: {
          validation: 'min_size',
          message: error || 'Invalid size',
          input,
        },
      };
    }
    return { output: input };
  };
}
