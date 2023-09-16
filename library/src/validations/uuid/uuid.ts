import type { PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a UUID.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function uuid<TInput extends string>(error?: string) {
  return (input: TInput): PipeResult<TInput> =>
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      input
    )
      ? getPipeIssues('uuid', error || 'Invalid UUID', input)
      : getOutput(input);
}
