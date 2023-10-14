import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the value of a string, number or date.
 *
 * @param requirement The maximum value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxValue<
  TInput extends string | number | bigint | Date,
  const TRequirement extends TInput
>(requirement: TRequirement, error?: ErrorMessage) {
  return {
    kind: 'max_value' as const,
    message: error ?? 'Invalid value',
    requirement,
    _parse(input: TInput): PipeResult<TInput> {
      return input > requirement
        ? getPipeIssues(this.kind, this.message, input)
        : getOutput(input);
    },
  };
}

/**
 * See {@link maxValue}
 *
 * @deprecated Function has been renamed to `maxValue`.
 */
export const maxRange = maxValue;
