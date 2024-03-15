import { IPV4_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * IPv4 validation type.
 */
export interface Ipv4Validation<TInput extends string>
  extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'ipv4';
  /**
   * The IPv4 regex.
   */
  requirement: RegExp;
}

/**
 * Creates a pipeline validation action that validates an [IPv4](https://en.wikipedia.org/wiki/IPv4) address.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function ipv4<TInput extends string>(
  message?: ErrorMessage
): Ipv4Validation<TInput> {
  return {
    type: 'ipv4',
    expects: null,
    async: false,
    message,
    requirement: IPV4_REGEX,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, ipv4, input, 'IPv4');
    },
  };
}
