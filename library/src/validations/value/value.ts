import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getLeafIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates the value of a string or number.
 *
 * @param requirement The value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function value<
  TInput extends string | number | bigint,
  TRequirement extends TInput
>(requirement: TRequirement, error?: string) {
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    if (input !== requirement) {
      return {
        issues: [
          getLeafIssue(
            {
              validation: 'value',
              message: error || 'Invalid value',
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
