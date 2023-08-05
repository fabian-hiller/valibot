import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation function that validates a safe integer.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function safe<TInput extends number>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (!Number.isSafeInteger(input)) {
      throw new ValiError([
        {
          validation: 'safe',
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
