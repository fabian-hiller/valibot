import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates the byte length of a string.
 *
 * @param requirement The byte length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function bytes<TInput extends string>(
  requirement: number,
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (new TextEncoder().encode(input).length !== requirement) {
      throw new ValiError([
        getIssue(info, {
          validation: 'bytes',
          message: error || 'Invalid byte length',
          input,
        }),
      ]);
    }
    return input;
  };
}
