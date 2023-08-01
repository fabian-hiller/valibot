import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation functions that validates the value of a string or number.
 *
 * @param requirement The value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function value<
  TInput extends string | number | bigint,
  TRequirement extends TInput
>(requirement: TRequirement, error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (input !== requirement) {
      throw new ValiError([
        {
          validation: 'value',
          origin: 'value',
          message: error || i18next.t('validations.value'),
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
