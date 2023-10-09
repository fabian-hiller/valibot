import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues, isLuhnAlgo } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a IMEI.
 *
 * Format: AA-BBBBBB-CCCCCC-D
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function imei<TInput extends string>(error?: ErrorMessage) {
  const kind = 'imei' as const;
  const requirement = /^\d{2}[ |/|-]?\d{6}[ |/|-]?\d{6}[ |/|-]?\d$/;
  const message = error ?? ('Invalid IMEI' as const);
  return Object.assign(
    (input: TInput): PipeResult<TInput> =>
      !requirement.test(input) || !isLuhnAlgo(input)
        ? getPipeIssues(kind, message, input)
        : getOutput(input),
    {
      kind,
      requirement,
      message,
    }
  );
}
