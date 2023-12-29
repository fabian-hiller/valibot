import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Bitcoin Address validation type.
 */
export type BtcAddressValidation<TInput extends string> =
  BaseValidation<TInput> & {
    /**
     * The validation type.
     */
    type: 'btcAddress';
    /**
     * The BTC Address regex.
     */
    requirement: RegExp[];
  };

export const P2PKH_REGEX = /^1[1-9A-HJ-NP-Za-km-z]{25,34}$/u;
export const P2SH_REGEX = /^3[1-9A-HJ-NP-Za-km-z]{25,34}$/u;
export const BECH32_REGEX = /^bc1[\da-z]{6,90}/u; // Covers P2WPKH, P2WSH

/**
 * Creates a pipeline validation action that validates a [Bitcoin address](https://bitcoinwiki.org/wiki/bitcoin-address).
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function btcAddress<TInput extends string>(
  message: ErrorMessage = 'Invalid Btc Address'
): BtcAddressValidation<TInput> {
  return {
    type: 'btcAddress',
    async: false,
    message,
    requirement: [P2PKH_REGEX, P2SH_REGEX, BECH32_REGEX],
    _parse(input) {
      return !this.requirement[0].test(input) &&
        !this.requirement[1].test(input) &&
        !this.requirement[2].test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
