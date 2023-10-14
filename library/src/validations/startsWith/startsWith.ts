import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the start of a string.
 *
 * @param requirement The start string.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function startsWith<
  TInput extends string,
  const TRequirement extends string
>(requirement: TRequirement, error?: ErrorMessage) {
  return {
    kind: `starts_with` as const,
    message: error ?? 'Invalid start',
    requirement,
    _parse(input: TInput): PipeResult<TInput> {
      return !input.startsWith(requirement as any)
        ? getPipeIssues(this.kind, this.message, input)
        : getOutput(input);
    },
  };
}
