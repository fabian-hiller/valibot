import { IPV6_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput, isIPv6 } from '../../utils/index.ts';

/**
 * IPv6 validation type.
 */
export type Ipv6Validation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'ipv6';
  /**
   * The IPv6 regex.
   */
  requirement: [RegExp, typeof isIPv6];
};

/**
 * Creates a pipeline validation action that validates an [IPv6](https://en.wikipedia.org/wiki/IPv6) address.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function ipv6<TInput extends string>(
  message: ErrorMessage = 'Invalid IPv6'
): Ipv6Validation<TInput> {
  return {
    type: 'ipv6',
    async: false,
    message,
    requirement: [IPV6_REGEX, isIPv6],
    _parse(input) {
      return !(this.requirement[0].test(input) && this.requirement[1](input))
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
