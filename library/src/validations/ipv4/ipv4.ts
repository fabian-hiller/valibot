import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates an IP v4 address.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function ipv4<TInput extends string>(error?: ErrorMessage) {
  return (input: TInput): PipeResult<TInput> =>
    !/^(?:(?:25[0-5]|(?:2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/u.test(
      input
    )
      ? getPipeIssues('ipv4', error || 'Invalid IP v4', input)
      : getOutput(input);
}
