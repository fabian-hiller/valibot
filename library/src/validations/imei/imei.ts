import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues, isLuhnAlgo } from '../../utils/index.ts';

/**
 * Creates a validation function that validates a IMEI.
 *
 * Format: AA-BBBBBB-CCCCCC-D
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function imei<TInput extends string>(error?: ErrorMessage) {
  return (input: TInput): PipeResult<TInput> =>
    !/^\d{2}(?:[ /|-]?\d{6}){2}[ /|-]?\d$/u.test(input) || !isLuhnAlgo(input)
      ? getPipeIssues('imei', error || 'Invalid IMEI', input)
      : getOutput(input);
}
