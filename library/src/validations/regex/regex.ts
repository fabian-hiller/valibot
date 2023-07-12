import { ValiError } from '../../error';
import type { ValidateInfo } from '../../types';

/**
 * Creates a validation functions that validates a string with a regex.
 *
 * @param requirement The regex pattern.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function regex<TInput extends string>(
  requirement: RegExp,
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (!requirement.test(input)) {
      throw new ValiError([
        {
          validation: 'regex',
          origin: 'value',
          message: error || 'Invalid regex',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
