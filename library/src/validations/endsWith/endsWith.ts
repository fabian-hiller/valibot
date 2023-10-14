import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the end of a string.
 *
 * @param requirement The end string.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function endsWith<
  TInput extends string,
  const TRequirement extends string
>(requirement: TRequirement, error?: ErrorMessage) {
  return {
    kind: 'ends_with' as const,
    message: error ?? 'Invalid end',
    requirement,
    _parse(input: TInput): PipeResult<TInput> {
      return !input.endsWith(requirement as any)
        ? getPipeIssues(this.kind, this.message, input)
        : getOutput(input);
    },
  };
}
