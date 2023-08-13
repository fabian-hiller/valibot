import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is a multiple.
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
        getIssue(info, {
          validation: 'multipleOf',
          message: error || 'Invalid multiple',
          input,
        }),
      ]);
    }
    return input;
  };
}
