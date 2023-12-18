import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

type HashAlgorithm =
  | 'md5'
  | 'md4'
  | 'sha1'
  | 'sha256'
  | 'sha384'
  | 'sha512'
  | 'ripemd128'
  | 'ripemd160'
  | 'tiger128'
  | 'tiger160'
  | 'tiger192'
  | 'crc32'
  | 'crc32b'
  | 'adler32';

const algorithmsLength: Record<HashAlgorithm, number> = {
  md5: 32,
  md4: 32,
  sha1: 40,
  sha256: 64,
  sha384: 96,
  sha512: 128,
  ripemd128: 32,
  ripemd160: 40,
  tiger128: 32,
  tiger160: 40,
  tiger192: 48,
  crc32: 8,
  crc32b: 8,
  adler32: 8,
};

/**
 * Finite validation type.
 */
export type HashValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'hash';
  /**
   * The validation function.
   */
  requirement: RegExp;
};

/**
 * Creates a validation function that validates whether a string is hash.
 *
 * @param hashAlgo hashAlgo
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function hash<TInput extends string>(
  hashAlgo: keyof typeof algorithmsLength,
  message: ErrorMessage = 'Invalid hash format.'
): HashValidation<TInput> {
  return {
    type: 'hash',
    async: false,
    message,
    // eslint-disable-next-line security/detect-non-literal-regexp, regexp/strict
    requirement: new RegExp(
      `^[a-fA-F0-9]{${algorithmsLength[hashAlgo]}}$`,
      'u'
    ),
    _parse(input: TInput) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
