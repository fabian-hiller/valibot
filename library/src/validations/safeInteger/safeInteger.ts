import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates whether a number is a safe integer.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function safeInteger<TInput extends number>(error?: ErrorMessage) {
  const kind = 'safe_integer' as const;
  const requirement = Number.isSafeInteger;
  const message = error ?? ('Invalid safe integer' as const);
  return Object.assign(
    (input: TInput): PipeResult<TInput> =>
      !requirement(input)
        ? getPipeIssues(kind, message, input)
        : getOutput(input),
    {
      kind,
      requirement,
      message,
    }
  );
}
