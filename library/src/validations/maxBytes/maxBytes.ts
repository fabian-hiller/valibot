import { ValiError } from '../../error';
import type { ValidateInfo } from '../../types';

/**
 * Creates a validation functions that validates the byte length of a string.
 *
 * @param requirement The maximum length in byte.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxBytes<TInput extends string>(
  requirement: number,
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (new TextEncoder().encode(input).length > requirement) {
      throw new ValiError([
        {
          validation: 'max_bytes',
          origin: 'value',
          message: error || 'Invalid byte length',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
