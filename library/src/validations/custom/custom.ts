import { ValiError } from '../../error';
import type { ValidateInfo } from '../../types';

/**
 * Creates a custom validation function.
 *
 * @param requirement The validation function.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function custom<TInput>(
  requirement: (input: TInput) => boolean,
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (!requirement(input)) {
      throw new ValiError([
        {
          validation: 'custom',
          origin: 'value',
          message: error || 'Invalid input',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
