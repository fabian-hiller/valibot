import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation functions that validates the MIME type of a file.
 *
 * @param requirement The MIME types.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function mimeType<TInput extends File>(
  requirement: `${string}/${string}`[],
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (!requirement.includes(input.type as `${string}/${string}`)) {
      throw new ValiError([
        {
          validation: 'mime_type',
          origin: 'value',
          message: error || i18next.t('validations.mimeType'),
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
