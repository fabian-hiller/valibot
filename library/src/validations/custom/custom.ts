import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a custom validation function.
 *
 * @param requirement The validation function.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function custom<TInput>(
  requirement: (input: TInput) => boolean,
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (!requirement(input)) {
      throw new ValiError([
        {
          validation: 'custom',
          origin: 'value',
          message: error || i18next.t('validations.custom'),
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
