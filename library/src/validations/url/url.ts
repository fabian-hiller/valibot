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
  return (input: TInput): PipeResult<TInput> => {
    try {
      new URL(input);
      return getOutput(input);
    } catch (_) {
      return getPipeIssues('url', error || 'Invalid URL', input);
    }
  };
}
