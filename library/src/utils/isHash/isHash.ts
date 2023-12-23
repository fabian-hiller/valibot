import type { HashType } from '../../types/index.ts';

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
 * Checks whether a string is a hash of specific hash types.
 *
 * @param input The input to be checked.
 * @param hashTypes The array of hash types.
 *
 * @returns Whether input is valid.
 */
export function isHash(input: string, hashTypes: HashType[]) {
  if (hashTypes.length === 0) return false;
  // eslint-disable-next-line security/detect-non-literal-regexp
  return RegExp(
    hashTypes
      .map((htype) => `^[a-f0-9]{${hashLength[htype]}}`)
      .join('|')
      .concat('$'),
    'iu'
  ).test(input);
}
