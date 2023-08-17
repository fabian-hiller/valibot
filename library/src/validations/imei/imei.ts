import type { _ParseResult, ValidateInfo } from '../../types.ts';
import { getLeafIssue, isLuhnAlgo } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a IMEI.
 *
 * Format: AA-BBBBBB-CCCCCC-D
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function imei<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo): _ParseResult<TInput> => {
    if (
      !/^\d{2}[ |/|-]?\d{6}[ |/|-]?\d{6}[ |/|-]?\d$/.test(input) ||
      !isLuhnAlgo(input)
    ) {
      return {
        issues: [
          getLeafIssue(
            {
              validation: 'imei',
              message: error || 'Invalid IMEI',
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
