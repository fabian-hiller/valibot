import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the byte length of a string.
 *
 * @param requirement The maximum length in byte.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function maxBytes<
  TInput extends string,
  const TRequirement extends number
>(requirement: TRequirement, error?: ErrorMessage) {
  return {
    type: 'max_bytes' as const,
    message: error ?? 'Invalid byte length',
    requirement,
    _parse(input: TInput): PipeResult<TInput> {
      return new TextEncoder().encode(input).length > requirement
        ? getPipeIssues(this.type, this.message, input)
        : getOutput(input);
    },
  };
}
