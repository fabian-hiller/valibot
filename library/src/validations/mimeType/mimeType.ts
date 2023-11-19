import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * MIME type validation type.
 */
export interface MimeTypeValidation<
  TInput extends Blob,
  TRequirement extends `${string}/${string}`[]
> extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'mime_type';
  /**
   * The MIME types.
   */
  requirement: TRequirement;
}

/**
 * Creates a validation function that validates the MIME type of a file.
 *
 * @param requirement The MIME types.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function mimeType<
  TInput extends Blob,
  TRequirement extends `${string}/${string}`[]
>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid MIME type'
): MimeTypeValidation<TInput, TRequirement> {
  return {
    type: 'mime_type',
    async: false,
    message,
    requirement,
    _parse(input) {
      return !this.requirement.includes(input.type as `${string}/${string}`)
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
