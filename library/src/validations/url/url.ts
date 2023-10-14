import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates a URL.
 *
 * Hint: The value is passed to the URL constructor to check if it is valid.
 * This check is not perfect. For example, values like "abc:1234" are accepted.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function url<TInput extends string>(error?: ErrorMessage) {
  return {
    kind: 'url' as const,
    message: error ?? 'Invalid URL',
    _parse(input: TInput): PipeResult<TInput> {
      try {
        new URL(input);
        return getOutput(input);
      } catch {
        return getPipeIssues(this.kind, this.message, input);
      }
    },
  };
}
