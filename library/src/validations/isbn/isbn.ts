import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * ISBN validation type.
 */
export type IsbnValidation<
  TInput extends string,
  TVersion extends 10 | 13
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'isbn';
  /**
   * The ISBN validation function.
   */
  requirement: (input: TInput, version: TVersion) => boolean;
};

/**
 * Creates a pipeline validation action that validates an [ISBN](https://en.wikipedia.org/wiki/ISBN).
 *
 * @param version Version could be 10 for ISBN-10 and 13 for ISBN-13.
 * @param message The error message
 *
 * @returns A validation action.
 */
export function isbn<TInput extends string, TVersion extends 10 | 13>(
  version: TVersion,
  message: ErrorMessage = 'Invalid ISBN'
): IsbnValidation<TInput, TVersion> {
  return {
    type: 'isbn',
    async: false,
    message,
    requirement: isISBN,
    _parse(input) {
      return !this.requirement(input, version)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}

const ISBN10_REGEX = /^\d{9}[\dX]$/u;
const ISBN13_REGEX = /^\d{13}$/u;

function isISBN(isbn: string, version: 10 | 13): boolean {
  const sanitizedIsbn = isbn.replace(/[\s-]+/gu, '');
  if (version === 10 && ISBN10_REGEX.test(sanitizedIsbn)) {
    return isISBN10(sanitizedIsbn);
  }
  if (version === 13 && ISBN13_REGEX.test(sanitizedIsbn)) {
    return isISBN13(sanitizedIsbn);
  }
  return false;
}

function isISBN10(isbn: string): boolean {
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += (i + 1) * parseInt(isbn[i]);
  }
  sum += isbn[9] === 'X' ? 10 * 10 : 10 * parseInt(isbn[9]);
  return sum % 11 === 0;
}

function isISBN13(isbn: string): boolean {
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3);
  }
  return sum % 10 === 0;
}
