import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation functions that validates a time.
 *
 * Format: hh:mm
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoTime<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (!/^(0[1-9]|1\d|2[0-3]):[0-5]\d$/.test(input)) {
      throw new ValiError([
        {
          validation: 'iso_time',
          origin: 'value',
          message: error || i18next.t('validations.isoTime'),
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
