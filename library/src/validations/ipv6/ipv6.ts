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
 * Creates a pipeline validation action that validates an [IPv6](https://en.wikipedia.org/wiki/IPv6) address.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function ipv6<TInput extends string>(
  message?: ErrorMessage
): Ipv6Validation<TInput> {
  return {
    type: 'ipv6',
    expects: null,
    async: false,
    message,
    requirement: IPV6_REGEX,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, ipv6, input, 'IPv6');
    },
  };
}
