import { IPV4_CIDR_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * IPv4 CIDR validation type.
 */
export type Ipv4CidrValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'ipv4cidr';
  /**
   * The IPv4 CIDR regex.
   */
  requirement: RegExp;
};

/**
 * Creates a pipeline validation action that validates a [IPv4 CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#IPv4_CIDR_blocks) notation.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function ipv4Cidr<TInput extends string>(
  message: ErrorMessage = 'Invalid IPv4 CIDR'
): Ipv4CidrValidation<TInput> {
  return {
    type: 'ipv4cidr',
    async: false,
    message,
    requirement: IPV4_CIDR_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
