import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the size of a map, set or blob.
 * @param requirement The size.
 * @param error The error message.
 * @returns A validation function.
 */
export function size<TInput extends Map<any, any> | Set<any> | Blob>(
  requirement: number,
  error?: ErrorMessage
) {
  return (input: TInput): PipeResult<TInput> =>
    input.size !== requirement
      ? getPipeIssues('size', error || 'Invalid size', input)
      : getOutput(input);
}
