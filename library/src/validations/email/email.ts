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
  return (input: TInput): PipeResult<TInput> =>
    !/^(“|[A-Z0-9_+-]+\.?)*[A-Z0-9_+-]”?@(([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}|([0-9]{3}\.[0-9]{3}\.[0-9]{3}\.[0-9]{3}))$/i.test(
      input
    )
      ? getPipeIssues('email', error || 'Invalid email', input)
      : getOutput(input);
}
