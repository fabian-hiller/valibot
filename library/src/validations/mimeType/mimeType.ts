import type { ParseResult, ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

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
  return (input: TInput, info: ValidateInfo): ParseResult<TInput> => {
    if (!requirement.includes(input.type as `${string}/${string}`)) {
      return {
        issues: [
          getIssue(info, {
            validation: 'mime_type',
            message: error || 'Invalid MIME type',
            input,
          }),
        ],
      };
    }
    return { output: input };
  };
}
