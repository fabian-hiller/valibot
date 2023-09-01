import type { FString, PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates the value of a string, number or date.
 *
 * @param requirement The minimum value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minValue<
  TInput extends string | number | bigint | Date,
  TRequirement extends TInput
>(requirement: TRequirement, error?: FString) {
  return (input: TInput): PipeResult<TInput> => {
    if (input < requirement) {
      return {
        issue: {
          validation: 'min_value',
          message: error || 'Invalid value',
          input,
        },
      };
    }
    return { output: input };
  };
}

/**
 * See {@link minValue}
 *
 * @deprecated Function has been renamed to `minValue`.
 */
export const minRange = minValue;
