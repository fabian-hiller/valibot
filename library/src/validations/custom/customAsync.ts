import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getLeafIssue } from '../../utils/index.ts';

/**
 * Creates a async custom validation function.
 *
 * @param requirement The async validation function.
 * @param error The error message.
 *
 * @returns A async validation function.
 */
export function customAsync<TInput>(
  requirement: (input: TInput) => Promise<boolean>,
  error?: string
) {
  return async (
    input: TInput,
    info: ValidateInfo
  ): Promise<_ParseResult<TInput>> => {
    if (!(await requirement(input))) {
      return {
        issues: [
          getLeafIssue(
            {
              validation: 'custom',
              message: error || 'Invalid input',
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
