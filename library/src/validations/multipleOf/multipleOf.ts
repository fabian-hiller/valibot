import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation function that validates a multiple of a number.
 *
 * @param requirement The divisor.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function multipleOf<TInput extends number>(
  requirement: number,
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (input % requirement !== 0) {
      throw new ValiError([
        {
          validation: 'multipleOf',
          origin: 'value',
          message: error || 'Invalid multiple',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
