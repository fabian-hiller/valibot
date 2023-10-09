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
  const kind = `ulid` as const;
  const requirement = /^[0-9A-HJKMNPQ-TV-Z]{26}$/i;
  const message = error ?? ('Invalid ULID' as const);
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
