import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a URL.
 *
 * Hint: The value is passed to the URL constructor to check if it is valid.
 * This check is not perfect. For example, values like "abc:1234" are accepted.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function url<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    try {
      new URL(input);
      return { output: input };
    } catch (_) {
      return {
        issues: [
          getIssue(info, {
            validation: 'url',
            message: error || 'Invalid URL',
            input,
          }),
        ],
      };
    }
  };
}
