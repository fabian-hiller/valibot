import { isLuhnAlgo } from '../../utils/index.ts';

import type { FString, PipeResult } from '../../types.ts';
/**
 * Creates a validation functions that validates a IMEI.
 *
 * Format: AA-BBBBBB-CCCCCC-D
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function imei<TInput extends string>(error?: FString) {
  return (input: TInput): PipeResult<TInput> => {
    if (
      !/^\d{2}[ |/|-]?\d{6}[ |/|-]?\d{6}[ |/|-]?\d$/.test(input) ||
      !isLuhnAlgo(input)
    ) {
      return {
        issue: {
          validation: 'imei',
          message: error || 'Invalid IMEI',
          input,
        },
      };
    }
    return { output: input };
  };
}
