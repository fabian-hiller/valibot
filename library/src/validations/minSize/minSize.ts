import type { PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates the size of a map, set or blob.
 *
 * @param requirement The minimum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function minSize<TInput extends Map<any, any> | Set<any> | Blob>(
  requirement: number,
  error?: string
) {
  return (input: TInput): PipeResult<TInput> =>
    input.size < requirement
      ? getPipeIssues('min_size', error || 'Invalid size', input)
      : getOutput(input);
}
