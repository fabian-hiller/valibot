import type { FString, PipeResult } from '../../types.ts';

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
>(requirement: TRequirement, error?: FString) {
  return (input: TInput): PipeResult<TInput> => {
    if (input !== requirement) {
      return {
        issue: {
          validation: 'equal',
          message: error || 'Invalid input',
          input,
        },
      };
    }
    return { output: input };
  };
}
