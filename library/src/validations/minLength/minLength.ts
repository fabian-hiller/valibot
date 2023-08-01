import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation functions that validates the length of a string or array.
 *
 * @param requirement The minimum length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minLength<TInput extends string | any[]>(
  requirement: number,
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (input.length < requirement) {
      throw new ValiError([
        {
          validation: 'min_length',
          origin: 'value',
          message: error || i18next.t('validations.minLength'),
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
