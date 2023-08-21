import type { _ParseResult, ValidateInfo } from '../../types.ts';
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
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    if (!requirement.test(input)) {
      return {
        issues: [
          getIssue(info, {
            validation: 'regex',
            message: error || 'Invalid regex',
            input,
          }),
        ],
      };
    }
    return { output: input };
  };
}
