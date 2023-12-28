import { ETHEREUM_ADDRESS_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Ethereum address validation type.
 */
export type EthereumAddressValidation<TInput extends string> =
  BaseValidation<TInput> & {
    /**
     * The validation type.
     */
    type: 'ethereumAddress';
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
export function ethereumAddress<TInput extends string>(
  message: ErrorMessage = 'Invalid Ethereum address'
): EthereumAddressValidation<TInput> {
  return {
    type: 'ethereumAddress',
    async: false,
    message,
    requirement: ETHEREUM_ADDRESS_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
