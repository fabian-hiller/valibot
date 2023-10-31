import { IPV4_REGEX } from '../../regex.ts';
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
  return {
    type: 'ipv4' as const,
    message: error ?? 'Invalid IP v4',
    requirement: IPV4_REGEX,
    _parse(input: TInput): PipeResult<TInput> {
      return !this.requirement.test(input)
        ? getPipeIssues(this.type, this.message, input)
        : getOutput(input);
    },
  };
}
