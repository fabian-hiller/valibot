import type { FString, PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates a string with a regex.
 *
 * @param requirement The regex pattern.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function regex<TInput extends string>(
  requirement: RegExp,
  error?: FString
) {
  return (input: TInput): PipeResult<TInput> => {
    if (!requirement.test(input)) {
      return {
        issue: {
          validation: 'regex',
          message: error || 'Invalid regex',
          input,
        },
      };
    }
    return { output: input };
  };
}
