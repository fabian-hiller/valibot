import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation functions that validates a IP v4 address.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function ipv4<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(input)) {
      throw new ValiError([
        {
          validation: 'ipv4',
          origin: 'value',
          message: error || i18next.t('validations.ipv4'),
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
