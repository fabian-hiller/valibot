import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates a [ULID](https://github.com/ulid/spec).
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function ulid<TInput extends string>(error?: ErrorMessage) {
  return {
    kind: `ulid` as const,
    message: error ?? 'Invalid ULID',
    requirement: /^[0-9A-HJKMNPQ-TV-Z]{26}$/i,
    _parse(input: TInput): PipeResult<TInput> {
      return !this.requirement.test(input)
        ? getPipeIssues(this.kind, this.message, input)
        : getOutput(input);
    },
  };
}
