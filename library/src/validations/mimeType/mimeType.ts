import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * MIME type validation type.
 */
export type MimeTypeValidation<
  TInput extends Blob,
  TRequirement extends `${string}/${string}`[]
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'mime_type';
  /**
   * The MIME types.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the MIME type of a file.
 *
 * @param requirement The MIME types.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function mimeType<
  TInput extends Blob,
  TRequirement extends `${string}/${string}`[]
>(
  requirement: TRequirement,
  message?: ErrorMessage
): MimeTypeValidation<TInput, TRequirement> {
  return {
    type: 'mime_type',
    expects: requirement.map((option) => `"${option}"`).join(' | '),
    async: false,
    message,
    requirement,
    _parse(input) {
      if (this.requirement.includes(input.type as `${string}/${string}`)) {
        return actionOutput(input);
      }
      return actionIssue(this, mimeType, input, 'MIME type');
    },
  };
}
