import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is an integer.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function integer<TInput extends number>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (!Number.isInteger(input)) {
      throw new ValiError([
        getIssue(info, {
          validation: 'integer',
          message: error || 'Invalid integer',
          input,
        }),
      ]);
    }
    return input;
  };
}
