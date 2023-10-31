import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the value of a string or number.
 *
 * @param requirement The value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function value<
  TInput extends string | number | bigint,
  const TRequirement extends TInput
>(requirement: TRequirement, error?: ErrorMessage) {
  return {
    type: 'value' as const,
    message: error ?? 'Invalid value',
    requirement,
    _parse(input: TInput): PipeResult<TInput> {
      return input !== requirement
        ? getPipeIssues(this.type, this.message, input)
        : getOutput(input);
    },
  };
}
