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
  return {
    type: 'ipv6' as const,
    message: error ?? 'Invalid IP v6',
    requirement: IPV6_REGEX,
    _parse(input: TInput): PipeResult<TInput> {
      return !this.requirement.test(input)
        ? getPipeIssues(this.type, this.message, input)
        : getOutput(input);
    },
  };
}
