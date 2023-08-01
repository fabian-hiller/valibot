import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a async custom validation function.
 *
 * @param requirement The async validation function.
 * @param error The error message.
 *
 * @returns A async validation function.
 */
export function customAsync<TInput>(
  requirement: (input: TInput) => Promise<boolean>,
  error?: string
) {
  return async (input: TInput, info: ValidateInfo) => {
    if (!(await requirement(input))) {
      throw new ValiError([
        {
          validation: 'custom',
          origin: 'value',
          message: error || i18next.t('validations.customAsync'),
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
