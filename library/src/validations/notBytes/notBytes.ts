import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the byte length of a string.
 *
 * @param requirement The byte length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function notBytes<
  TInput extends string,
  const TRequirement extends number
>(requirement: TRequirement, error?: ErrorMessage) {
  const kind = 'not_bytes' as const;
  const message = error ?? 'Invalid byte length';
  return Object.assign(
    (input: TInput): PipeResult<TInput> =>
      new TextEncoder().encode(input).length === requirement
        ? getPipeIssues(kind, message, input)
        : getOutput(input),
    {
      kind,
      requirement,
      message,
    }
  );
}
