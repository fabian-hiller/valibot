import type { ErrorMessage, PipeResult } from '../../types';
import { getOutput, getPipeIssues } from '../../utils';

/**
 * Creates a validation functions that validates a [ULID](https://github.com/ulid/spec).
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function ulid<TInput extends string>(error?: ErrorMessage) {
  return (input: TInput): PipeResult<TInput> =>
    !/^[0-9A-HJKMNPQ-TV-Z]{26}$/i.test(input)
      ? getPipeIssues('ulid', error || 'Invalid ULID', input)
      : getOutput(input);
}
