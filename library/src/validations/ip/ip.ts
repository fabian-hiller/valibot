import { IPV4_REGEX, IPV6_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * IP validation type.
 */
export type IpValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'ip';
  /**
   * The IPv4 and IPv6 regex.
   */
  requirement: [RegExp, RegExp];
};

/**
 * Creates a pipeline validation action that validates an [IPv4](https://en.wikipedia.org/wiki/IPv4)
 * or [IPv6](https://en.wikipedia.org/wiki/IPv6) address.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function ip<TInput extends string>(
  message?: ErrorMessage
): IpValidation<TInput> {
  return {
    type: 'ip',
    expects: null,
    async: false,
    message,
    // TODO: It is strange that we have an OR relationship between requirements
    requirement: [IPV4_REGEX, IPV6_REGEX],
    _parse(input) {
      if (this.requirement[0].test(input) || this.requirement[1].test(input)) {
        return actionOutput(input);
      }
      return actionIssue(this, input, 'IP');
    },
  };
}
