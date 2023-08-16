import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is finite.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function finite<TInput extends number>(error?: string) {
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    if (!Number.isFinite(input)) {
      return {
        issues: [
          getIssue(info, {
            validation: 'finite',
            message: error || 'Invalid finite number',
            input,
          }),
        ],
      };
    }
    return { output: input };
  };
}
