import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getLeafIssue } from '../../utils/index.ts';

/**
 * Creates a validation function that checks the value for equality.
 *
 * @param requirement The required value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function equal<
  TInput extends string | number | bigint | boolean,
  TRequirement extends TInput
>(requirement: TRequirement, error?: string) {
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    if (input !== requirement) {
      return {
        issues: [
          getLeafIssue(
            {
              validation: 'equal',
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
