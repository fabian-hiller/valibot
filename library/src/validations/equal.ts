import { ValiError } from '../error';
import type { ValidateInfo } from '../types';

/**
 * Creates a validation function that checks the value for equality.
 *
 * @param requirement The required value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function equal<
  TInput extends string | number | bigint | boolean,
  TRequirement extends TInput
>(requirement: TRequirement, error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (input !== requirement) {
      throw new ValiError([
        {
          validation: 'equal',
          origin: 'value',
          message: error || 'Invalid input',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
