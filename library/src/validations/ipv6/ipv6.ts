import { IPV6_REGEX } from '../../regex.ts';
import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates an IP v6 address.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function ipv6<TInput extends string>(error?: ErrorMessage) {
  return (input: TInput): PipeResult<TInput> =>
    !IPV6_REGEX.test(input)
      ? getPipeIssues('ipv6', error || 'Invalid IP v6', input)
      : getOutput(input);
}
