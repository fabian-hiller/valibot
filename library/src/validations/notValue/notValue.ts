import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates the value of a string or number.
 *
 * @param requirement The value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function notValue<
  TInput extends string | number | bigint,
  const TRequirement extends TInput
>(requirement: TRequirement, error?: ErrorMessage) {
  const kind = 'not_value' as const;
  const message = error ?? ('Invalid value' as const);
  return Object.assign(
    (input: TInput): PipeResult<TInput> =>
      input === requirement
        ? getPipeIssues(kind, message, input)
        : getOutput(input),
    {
      kind,
      requirement,
      message,
    }
  );
}
