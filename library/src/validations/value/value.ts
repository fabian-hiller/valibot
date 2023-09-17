import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

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
>(requirement: TRequirement, error?: ErrorMessage) {
  return (input: TInput): PipeResult<TInput> =>
    input !== requirement
      ? getPipeIssues('value', error || 'Invalid value', input)
      : getOutput(input);
}
