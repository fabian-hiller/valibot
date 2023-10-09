import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a URL.
 *
 * Hint: The value is passed to the URL constructor to check if it is valid.
 * This check is not perfect. For example, values like "abc:1234" are accepted.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function url<TInput extends string>(error?: ErrorMessage) {
  const kind = 'url' as const;
  const message = error ?? ('Invalid URL' as const);
  return Object.assign(
    (input: TInput): PipeResult<TInput> => {
      try {
        new URL(input);
        return getOutput(input);
      } catch {
        return getPipeIssues(kind, message, input);
      }
    },
    {
      kind,
      message,
    }
  );
}
