import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates a [cuid2](https://github.com/paralleldrive/cuid2#cuid2).
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function cuid2<TInput extends string>(error?: ErrorMessage) {
  return {
    kind: 'cuid2' as const,
    message: error ?? 'Invalid cuid2',
    requirement: /^[a-z][a-z0-9]*$/,
    _parse(input: TInput): PipeResult<TInput> {
      return !this.requirement.test(input)
        ? getPipeIssues(this.kind, this.message, input)
        : getOutput(input);
    },
  };
}
