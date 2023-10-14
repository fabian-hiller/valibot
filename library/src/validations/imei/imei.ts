import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues, isLuhnAlgo } from '../../utils/index.ts';

/**
 * Creates a validation function that validates an IMEI.
 *
 * Format: AA-BBBBBB-CCCCCC-D
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function imei<TInput extends string>(error?: ErrorMessage) {
  return {
    kind: 'imei' as const,
    message: error ?? 'Invalid IMEI',
    requirement: /^\d{2}[ |/|-]?\d{6}[ |/|-]?\d{6}[ |/|-]?\d$/,
    _parse(input: TInput): PipeResult<TInput> {
      return !this.requirement.test(input) || !isLuhnAlgo(input)
        ? getPipeIssues(this.kind, this.message, input)
        : getOutput(input);
    },
  };
}
