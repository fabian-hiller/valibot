import type { PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates the MIME type of a file.
 *
 * @param requirement The MIME types.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function mimeType<TInput extends Blob>(
  requirement: `${string}/${string}`[],
  error?: string
) {
  return (input: TInput): PipeResult<TInput> => {
    if (!requirement.includes(input.type as `${string}/${string}`)) {
      return {
        issue: {
          validation: 'mime_type',
          message: error || 'Invalid MIME type',
          input,
        },
      };
    }
    return { output: input };
  };
}
