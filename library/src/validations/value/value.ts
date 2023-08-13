import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates the value of a string or number.
 *
 * @param requirement The value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function value<
  TInput extends string | number | bigint,
  TRequirement extends TInput
>(requirement: TRequirement, error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (input !== requirement) {
      throw new ValiError([
        getIssue(info, {
          validation: 'value',
          message: error || 'Invalid value',
          input,
        }),
      ]);
    }
    return input;
  };
}
