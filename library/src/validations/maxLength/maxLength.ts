import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation functions that validates the length of a string or array.
 *
 * @param requirement The maximum length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxLength<TInput extends string | any[]>(
  requirement: number,
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (input.length > requirement) {
      throw new ValiError([
        {
          validation: 'max_length',
          origin: 'value',
          message: error || i18next.t('validations.maxLength'),
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
