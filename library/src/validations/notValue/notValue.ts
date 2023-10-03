import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a value to be different from the given value.
 *
 * @param requirement The value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function notValue<
  TInput extends string | number | bigint | boolean,
  TRequirement extends TInput
>(requirement: TRequirement, error: ErrorMessage = 'Invalid value') {
  return (input: TInput): PipeResult<TInput> =>
    input === requirement
      ? getPipeIssues('not_value', error, input)
      : getOutput(input);
}
