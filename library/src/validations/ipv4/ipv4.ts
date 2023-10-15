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
    !/^(?:(?:(?=(25[0-5]))\1|(?=(2[0-4]\d))\2|(?=(1\d{2}))\3|(?=(\d{1,2}))\4)\.){3}(?:(?=(25[0-5]))\5|(?=(2[0-4]\d))\6|(?=(1\d{2}))\7|(?=(\d{1,2}))\8)$/u.test(
      input
    )
      ? getPipeIssues('ipv4', error || 'Invalid IP v4', input)
      : getOutput(input);
}
