import type { FString, PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates the value of a string, number or date.
 *
 * @param requirement The maximum value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxValue<
  TInput extends string | number | bigint | Date,
  TRequirement extends TInput
>(requirement: TRequirement, error?: FString) {
  return (input: TInput): PipeResult<TInput> => {
    if (input > requirement) {
      return {
        issue: {
          validation: 'max_value',
          message: error || 'Invalid value',
          input,
        },
      };
    }
    return { output: input };
  };
}

/**
 * See {@link maxValue}
 *
 * @deprecated Function has been renamed to `maxValue`.
 */
export const maxRange = maxValue;
