import { ValiError } from '../error';
import type { ValidateInfo } from '../types';

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
        {
          validation: 'length',
          origin: 'value',
          message: error || 'Invalid length',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
