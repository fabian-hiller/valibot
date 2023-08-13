import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates the length of a string or array.
 *
 * @param requirement The length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function length<TInput extends string | any[]>(
  requirement: number,
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (input.length !== requirement) {
      throw new ValiError([
        getIssue(info, {
          validation: 'length',
          message: error || 'Invalid length',
          input,
        }),
      ]);
    }
    return input;
  };
}
