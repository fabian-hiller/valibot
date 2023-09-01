import type { FString, PipeResult } from '../../types.ts';

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
>(requirement: TRequirement, error?: FString) {
  return (input: TInput): PipeResult<TInput> => {
    if (input !== requirement) {
      return {
        issue: {
          validation: 'value',
          message: error || 'Invalid value',
          input,
        },
      };
    }
    return { output: input };
  };
}
