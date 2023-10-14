import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is a multiple.
 *
 * @param requirement The divisor.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function multipleOf<
  TInput extends number,
  const TRequirement extends number
>(requirement: TRequirement, error?: ErrorMessage) {
  return {
    kind: 'multiple_of' as const,
    message: error ?? 'Invalid multiple',
    requirement,
    _parse(input: TInput): PipeResult<TInput> {
      return input % requirement !== 0
        ? getPipeIssues(this.kind, this.message, input)
        : getOutput(input);
    },
  };
}
