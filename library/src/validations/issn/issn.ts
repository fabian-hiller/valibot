import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * ISSN validation type.
 */
export type IssnValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'issn';
  /**
   * The ISSN validation function.
   */
  requirement: (input: TInput) => boolean;
};

/**
 * Creates a pipeline validation action that validates an [ISSN](https://en.wikipedia.org/wiki/ISSN).
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function issn<TInput extends string>(
  message: ErrorMessage = 'Invalid ISSN'
): IssnValidation<TInput> {
  return {
    type: 'issn',
    async: false,
    message,
    requirement: isISSN,
    _parse(input) {
      return !this.requirement(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}

const ISSN_REGEX = /^(?!0{4}-?0{3}[0X])\d{4}-?\d{3}[\dX]$/iu;

function isISSN(issn: string): boolean {
  issn = issn.toUpperCase();
  if (!ISSN_REGEX.test(issn)) {
    return false;
  }

  const numbers = issn
    .replace('-', '')
    .split('')
    .map((digit, index) => {
      return digit === 'X' ? 10 : parseInt(digit, 10) * (8 - index);
    });

  const sum = numbers.reduce((acc, value) => acc + value, 0);
  return sum % 11 === 0;
}
