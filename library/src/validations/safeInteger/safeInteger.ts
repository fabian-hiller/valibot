import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is a safe integer.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function safeInteger<TInput extends number>(error?: string) {
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    if (!Number.isSafeInteger(input)) {
      return {
        issues: [
          getIssue(info, {
            validation: 'safe_integer',
            message: error || 'Invalid safe integer',
            input,
          }),
        ],
      };
    }
    return { output: input };
  };
}
