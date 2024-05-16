import { IPV6_CIDR_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * IPv6 CIDR validation type.
 */
export type Ipv6CidrValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'ipv6cidr';
  /**
   * The IPv6 CIDR regex.
   */
  requirement: RegExp;
};

/**
 * Creates a pipeline validation action that validates a [IPv6 CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#IPv6_CIDR_blocks) notation.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function ipv6Cidr<TInput extends string>(
  message: ErrorMessage = 'Invalid IPv6 CIDR'
): Ipv6CidrValidation<TInput> {
  return {
    type: 'ipv6cidr',
    async: false,
    message,
    requirement: IPV6_CIDR_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
