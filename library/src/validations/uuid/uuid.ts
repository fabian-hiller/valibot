import type { ParseResult, ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a UUID.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function uuid<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo): ParseResult<TInput> => {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        input
      )
    ) {
      return {
        issues: [
          getIssue(info, {
            validation: 'uuid',
            message: error || 'Invalid UUID',
            input,
          }),
        ],
      };
    }
    return { output: input };
  };
}
