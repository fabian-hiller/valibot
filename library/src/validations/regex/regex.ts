import type { PipeResult } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

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
  error?: string
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
    return getOutput(input);
  };
}
