import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

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
        getIssue(info, {
          validation: 'safe_integer',
          message: error || 'Invalid safe integer',
          input,
        }),
      ]);
    }
    return input;
  };
}
