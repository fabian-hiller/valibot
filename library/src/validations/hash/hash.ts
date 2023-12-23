import type {
  BaseValidation,
  ErrorMessage,
  HashType,
} from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Hash validation type.
 */
export type HashValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'hash';
  /**
   * Map with hash type and validation regular expression.
   */
  requirement: (input: string, hashTypes: HashType[]) => boolean;
};

const hashLength: Record<HashType, number> = {
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
 * Creates a validation function that validates whether a string is one of hash types.
 *
 * @param hashType hashType
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function hash<TInput extends string, THashTypes extends HashType[]>(
  hashType: THashTypes,
  message: ErrorMessage = 'Invalid hash format.'
): HashValidation<TInput> {
  return {
    type: 'hash',
    async: false,
    message,
    requirement: (input: string, hashTypes: HashType[]) => {
      if (hashTypes.length === 0) return false;
      // eslint-disable-next-line security/detect-non-literal-regexp
      return RegExp(
        hashTypes
          .map((htype) => `^[a-f0-9]{${hashLength[htype]}}`)
          .join('|')
          .concat('$'),
        'iu'
      ).test(input);
    },
    _parse(input: TInput) {
      return !this.requirement(input, hashType)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
