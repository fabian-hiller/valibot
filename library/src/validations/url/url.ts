import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation functions that validates a URL.
 *
 * Hint: The value is passed to the URL constructor to check if it is valid.
 * This check is not perfect. For example, values like "abc:1234" are accepted.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function url<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    try {
      new URL(input);
      return input;
    } catch (_) {
      throw new ValiError([
        {
          validation: 'url',
          origin: 'value',
          message: error || i18next.t('validations.url'),
          input,
          ...info,
        },
      ]);
    }
  };
}
