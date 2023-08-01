import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation functions that validates a UUID.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function uuid<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        input
      )
    ) {
      throw new ValiError([
        {
          validation: 'uuid',
          origin: 'value',
          message: error || i18next.t('validations.uuid'),
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
