import { describe, expect, test } from 'vitest';
import { isHash } from './isHash.ts';
import type { HashType } from '../../types/index.ts';

describe('isHash', () => {
  test('should return true for passing validation', () => {
    expect(isHash('d41d8cd98f00b204e9800998ecf8427e', ['md4'])).toBe(true);
    expect(isHash('c93d3bf7a7c4afe94b64e30c2ce39f4f', ['md5'])).toBe(true);
    expect(isHash('d033e22ae348aeb5660fc2140aec35850c4da997', ['sha1'])).toBe(
      true
    );
    expect(
      isHash(
        '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        ['sha256']
      )
    ).toBe(true);
    expect(
      isHash(
        '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b',
        ['sha384']
      )
    ).toBe(true);
    expect(isHash('c766f912a89d4ccda88e0cce6a713ef7', ['ripemd128'])).toBe(
      true
    );
    expect(
      isHash('9c1185a5c5e9fc54612808977ee8f548b2258d31', ['ripemd160'])
    ).toBe(true);
    expect(isHash('7ab383fc29d81f8d0d68e87c69bae5f1', ['tiger128'])).toBe(true);
    expect(
      isHash('7ab383fc29d81f8d0d68e87c69bae5f1f18266d7', ['tiger160'])
    ).toBe(true);
    expect(
      isHash('4dd00f9e8e8a6a8e3883af1051237c4b47bd2a329b1de1a3', ['tiger192'])
    ).toBe(true);
    expect(isHash('3d08bb77', ['crc32'])).toBe(true);
    expect(isHash('045d01c1', ['adler32'])).toBe(true);
    expect(isHash('c93d3bf7a7c4afe94b64e30c2ce39f4f', ['md5', 'sha1'])).toBe(
      true
    );
    expect(
      isHash('7ab383fc29d81f8d0d68e87c69bae5f1', ['md5', 'tiger128'])
    ).toBe(true);
  });

  test('should return false for rejecting validation', () => {
    const hashTypes: HashType[] = [
      'md4',
      'md5',
      'sha1',
      'sha256',
      'sha384',
      'ripemd128',
      'ripemd160',
      'tiger128',
      'tiger160',
      'tiger192',
      'crc32',
      'adler32',
    ];

    hashTypes.forEach((hashType) => {
      expect(isHash('', [hashType])).toBe(false);
      expect(isHash('12345', [hashType])).toBe(false);
      expect(isHash('abcdef&$#', [hashType])).toBe(false);
    });

    expect(isHash('d41d8cd98f00b204e9800998ecf8427ff', ['md4'])).toBe(false);
    expect(isHash('c93d3bf7a7c4afe94b64e30c2ce39f4ff', ['md5'])).toBe(false);
    expect(isHash('d033e22ae348aeb5660fc2140aec35850c4da9978', ['sha1'])).toBe(
      false
    );
    expect(
      isHash(
        '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a088',
        ['sha256']
      )
    ).toBe(false);
    expect(
      isHash(
        '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95bb',
        ['sha384']
      )
    ).toBe(false);
    expect(isHash('c766f912a89d4ccda88e0cce6a713ef77', ['ripemd128'])).toBe(
      false
    );
    expect(
      isHash('9c1185a5c5e9fc54612808977ee8f548b2258d311', ['ripemd160'])
    ).toBe(false);
    expect(isHash('7ab383fc29d81f8d0d68e87c69bae5f11', ['tiger128'])).toBe(
      false
    );
    expect(
      isHash('7ab383fc29d81f8d0d68e87c69bae5f1f18266d77', ['tiger160'])
    ).toBe(false);
    expect(
      isHash('4dd00f9e8e8a6a8e3883af1051237c4b47bd2a329b1de1a33', ['tiger192'])
    ).toBe(false);
    expect(isHash('3d08bb778', ['crc32'])).toBe(false);
    expect(isHash('045d01c12', ['adler32'])).toBe(false);
  });
});
