import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a email.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function email<TInput extends string>(error?: ErrorMessage) {
  const kind = 'email' as const;
  const requirement =
    /^[\w+-]+(?:\.[\w+-]+)*@[A-Z0-9]+(?:(?:\.|-)[A-Z0-9]+)*\.[A-Z]{2,}$/i;
  const message = error ?? ('Invalid email' as const);
  return Object.assign(
    (input: TInput): PipeResult<TInput> =>
      !requirement.test(input)
        ? getPipeIssues(kind, message, input)
        : getOutput(input),
    {
      kind,
      requirement,
      message,
    }
  );
}
