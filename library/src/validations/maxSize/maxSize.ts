import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the size of a map, set or blob.
 * @param requirement The maximum size.
 * @param error The error message.
 * @returns A validation function.
 */
export function maxSize<TInput extends Map<any, any> | Set<any> | Blob>(
  requirement: number,
  error?: ErrorMessage
) {
  return (input: TInput): PipeResult<TInput> =>
    input.size > requirement
      ? getPipeIssues('max_size', error || 'Invalid size', input)
      : getOutput(input);
}
