import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation function that validates an integer.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function integer<TInput extends number>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (!Number.isInteger(input)) {
      throw new ValiError([
        {
          validation: 'integer',
          origin: 'value',
          message: error || 'Invalid integer',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
