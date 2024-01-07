import { ETH_ADDRESS_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Ethereum address validation type.
 */
export type EthAddressValidation<TInput extends string> =
  BaseValidation<TInput> & {
    /**
     * The validation type.
     */
    type: 'ethAddress';
    /**
     * The Ethereum address regex.
     */
    requirement: RegExp;
  };

/**
 * Creates a pipeline validation action that validates a [Ethereum address](https://en.wikipedia.org/wiki/Ethereum).
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function ethAddress<TInput extends string>(
  message: ErrorMessage = 'Invalid Ethereum address'
): EthAddressValidation<TInput> {
  return {
    type: 'ethAddress',
    async: false,
    message,
    requirement: ETH_ADDRESS_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
