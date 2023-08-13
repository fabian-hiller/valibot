import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

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
  return (input: TInput, info: ValidateInfo) => {
    if (!requirement.test(input)) {
      throw new ValiError([
        getIssue(info, {
          validation: 'regex',
          message: error || 'Invalid regex',
          input,
        }),
      ]);
    }
    return input;
  };
}
