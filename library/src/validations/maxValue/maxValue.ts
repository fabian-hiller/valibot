import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation functions that validates the value of a string, number or date.
 *
 * @param requirement The maximum value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxValue<
  TInput extends string | number | bigint | Date,
  TRequirement extends TInput
>(requirement: TRequirement, error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (input > requirement) {
      throw new ValiError([
        {
          validation: 'max_value',
          origin: 'value',
          message: error || i18next.t('validations.maxValue'),
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}

/**
 * See {@link maxValue}
 *
 * @deprecated Function has been renamed to `maxValue`.
 */
export const maxRange = maxValue;
