import { ValiError } from '../../error';
import type { ValidateInfo } from '../../types';

/**
 * Creates a validation functions that validates the start of a string.
 *
 * @param requirement The start string.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function startsWith<TInput extends string>(
  requirement: string,
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (!input.startsWith(requirement as any)) {
      throw new ValiError([
        {
          validation: 'starts_with',
          origin: 'value',
          message: error || 'Invalid start',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
