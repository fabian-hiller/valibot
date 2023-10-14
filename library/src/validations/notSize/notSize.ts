import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the size of a map, set or blob.
 *
 * @param requirement The size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function notSize<
  TInput extends Map<any, any> | Set<any> | Blob,
  const TRequirement extends number
>(requirement: TRequirement, error?: ErrorMessage) {
  return {
    kind: 'not_size' as const,
    message: error ?? 'Invalid size',
    requirement,
    _parse(input: TInput): PipeResult<TInput> {
      return input.size === requirement
        ? getPipeIssues(this.kind, this.message, input)
        : getOutput(input);
    },
  };
}
