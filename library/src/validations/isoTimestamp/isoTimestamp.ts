import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation functions that validates a timestamp.
 *
 * Format: yyyy-mm-ddThh:mm:ss.sssZ
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31T00:00:00.000Z" is valid although
 * June has only 30 days.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoTimestamp<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (
      !/^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])T(0[1-9]|1\d|2[0-3]):[0-5]\d:[0-5]\d\.\d{3}Z$/.test(
        input
      )
    ) {
      throw new ValiError([
        {
          validation: 'iso_timestamp',
          origin: 'value',
          message: error || i18next.t('validations.isoTimestamp'),
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
