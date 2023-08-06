import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation function that validates whether a number is a safe integer.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function safeInteger<TInput extends number>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (!Number.isSafeInteger(input)) {
      throw new ValiError([
        {
          validation: 'safe_integer',
          origin: 'value',
          message: error || 'Invalid safe integer',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
