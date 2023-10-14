import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the length of a string or array.
 *
 * @param requirement The minimum length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minLength<
  TInput extends string | any[],
  const TRequirement extends number
>(requirement: TRequirement, error?: ErrorMessage) {
  return {
    kind: 'min_length' as const,
    message: error ?? 'Invalid length',
    requirement,
    _parse(input: TInput): PipeResult<TInput> {
      return input.length < requirement
        ? getPipeIssues(this.kind, this.message, input)
        : getOutput(input);
    },
  };
}
