import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the value of a string, number or date.
 *
 * @param requirement The minimum value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minValue<
  TInput extends string | number | bigint | Date,
  const TRequirement extends TInput
>(requirement: TRequirement, error?: ErrorMessage) {
  return {
    type: 'min_value' as const,
    message: error ?? 'Invalid value',
    requirement,
    _parse(input: TInput): PipeResult<TInput> {
      return input < requirement
        ? getPipeIssues(this.type, this.message, input)
        : getOutput(input);
    },
  };
}

/**
 * See {@link minValue}
 *
 * @deprecated Function has been renamed to `minValue`.
 */
export const minRange = minValue;
