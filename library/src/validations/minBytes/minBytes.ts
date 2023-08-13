import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates the byte length of a string.
 *
 * @param requirement The minimum length in byte.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minBytes<TInput extends string>(
  requirement: number,
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (new TextEncoder().encode(input).length < requirement) {
      throw new ValiError([
        getIssue(info, {
          validation: 'min_bytes',
          message: error || 'Invalid byte length',
          input,
        }),
      ]);
    }
    return input;
  };
}
