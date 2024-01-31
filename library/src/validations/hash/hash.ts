import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Hash lengths object.
 */
const HASH_LENGTHS = {
  md4: 32,
  md5: 32,
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
} as const;

/**
 * Hash type type.
 */
type HashType = keyof typeof HASH_LENGTHS;

/**
 * Hash validation type.
 */
export type HashValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'hash';
  /**
   * The hash regex.
   */
  requirement: RegExp;
};

/**
 * Creates a pipeline validation action that validates a hash string.
 *
 * @param types The hash types.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function hash<TInput extends string>(
  types: [HashType, ...HashType[]],
  message?: ErrorMessage
): HashValidation<TInput> {
  return {
    type: 'hash',
    expects: null,
    async: false,
    message,
    requirement: RegExp(
      types.map((type) => `^[a-f0-9]{${HASH_LENGTHS[type]}}$`).join('|'),
      'iu'
    ),
    _parse(input) {
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }
      return actionIssue(this, hash, input, 'hash');
    },
  };
}
