import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getLeafIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a UUID.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function uuid<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        input
      )
    ) {
      return {
        issues: [
          getLeafIssue(
            {
              reason: info.reason,
              validation: 'uuid',
              message: error || 'Invalid UUID',
              input,
            },
            info
          ),
        ],
      };
    }
    return { output: input };
  };
}
