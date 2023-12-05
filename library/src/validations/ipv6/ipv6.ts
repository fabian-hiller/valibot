import { IPV6_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * IPv6 validation type.
 */
export interface Ipv6Validation<TInput extends string>
  extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'ipv6';
  /**
   * The IPv6 regex.
   */
  requirement: RegExp;
}

/**
 * Creates a validation function that validates an [IPv6](https://en.wikipedia.org/wiki/IPv6) address.
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function ipv6<TInput extends string>(
  message: ErrorMessage = 'Invalid IPv6'
): Ipv6Validation<TInput> {
  return {
    type: 'ipv6',
    async: false,
    message,
    requirement: IPV6_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
