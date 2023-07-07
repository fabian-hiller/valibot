import { ValiError } from '../error';
import type { ValidateInfo } from '../types';

/**
 * Creates a validation functions that validates the range of a string, number or date.
 *
 * @param requirement The maximum range.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxRange<
  TInput extends string | number | bigint | Date,
  TRequirement extends TInput
>(requirement: TRequirement, error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (input > requirement) {
      throw new ValiError([
        {
          validation: 'max_range',
          origin: 'value',
          message: error || 'Invalid range',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
