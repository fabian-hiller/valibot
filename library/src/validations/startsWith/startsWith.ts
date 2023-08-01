import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation functions that validates the start of a string.
 *
 * @param requirement The start string.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function startsWith<TInput extends string>(
  requirement: string,
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (!input.startsWith(requirement as any)) {
      throw new ValiError([
        {
          validation: 'starts_with',
          origin: 'value',
          message: error || i18next.t('validations.startsWith'),
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
