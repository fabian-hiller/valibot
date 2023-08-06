import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation function that validates whether a number is finite.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function finite<TInput extends number>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (!Number.isFinite(input)) {
      throw new ValiError([
        {
          validation: 'finite',
          origin: 'value',
          message: error || 'Invalid finite number',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
