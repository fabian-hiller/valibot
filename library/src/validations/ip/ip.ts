import { IPV4_REGEX, IPV6_REGEX } from '../../regex.ts';
import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates an [IPv4](https://en.wikipedia.org/wiki/IPv4)
 * or [IPv6](https://en.wikipedia.org/wiki/IPv6) address.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function ip<TInput extends string>(error?: ErrorMessage) {
  return {
    kind: 'ip' as const,
    message: error ?? 'Invalid IP',
    requirement: [IPV4_REGEX, IPV6_REGEX] as const,
    _parse(input: TInput): PipeResult<TInput> {
      return !this.requirement.some((regex) => regex.test(input))
        ? getPipeIssues(this.kind, this.message, input)
        : getOutput(input);
    },
  };
}
