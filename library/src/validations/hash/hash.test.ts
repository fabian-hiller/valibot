import { describe, expect, test } from 'vitest';
import { hash } from './hash.ts';

describe('hash', () => {
  test('should pass only a valid hash string', () => {
    const validate = hash('md5');
    const value1 = 'd41d8cd98f00b204e9800998ecf8427e';
    expect(validate._parse(value1).output).toBe(value1);

    const validate2 = hash('md4');
    const value2 = 'c93d3bf7a7c4afe94b64e30c2ce39f4f';
    expect(validate2._parse(value2).output).toBe(value2);

    const validate3 = hash('sha1');
    const value3 = 'd033e22ae348aeb5660fc2140aec35850c4da997';
    expect(validate3._parse(value3).output).toBe(value3);

    const validate4 = hash('sha256');
    const value4 =
      '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
    expect(validate4._parse(value4).output).toBe(value4);

    const validate5 = hash('sha384');
    const value5 =
      '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b';
    expect(validate5._parse(value5).output).toBe(value5);

    const validate6 = hash('ripemd128');
    const value6 = 'c766f912a89d4ccda88e0cce6a713ef7';
    expect(validate6._parse(value6).output).toBe(value6);

    const validate7 = hash('ripemd160');
    const value7 = '9c1185a5c5e9fc54612808977ee8f548b2258d31';
    expect(validate7._parse(value7).output).toBe(value7);

    const validate8 = hash('tiger128');
    const value8 = '7ab383fc29d81f8d0d68e87c69bae5f1';
    expect(validate8._parse(value8).output).toBe(value8);

    const validate9 = hash('tiger160');
    const value9 = '7ab383fc29d81f8d0d68e87c69bae5f1f18266d7';
    expect(validate9._parse(value9).output).toBe(value9);

    const validate10 = hash('tiger192');
    const value10 = '4dd00f9e8e8a6a8e3883af1051237c4b47bd2a329b1de1a3';
    expect(validate10._parse(value10).output).toBe(value10);

    const validate11 = hash('crc32');
    const value11 = '3d08bb77';
    expect(validate11._parse(value11).output).toBe(value11);

    const validate12 = hash('crc32');
    const value12 = 'd87f7e0c';
    expect(validate12._parse(value12).output).toBe(value12);

    const validate13 = hash('adler32');
    const value13 = '045d01c1';
    expect(validate13._parse(value13).output).toBe(value13);
  });

  test('should reject invalid hash strings', () => {
    const validate = hash('md5');
    expect(validate._parse('12345').issues).toBeTruthy();
    expect(
      validate._parse('zxcvbnmasdfghjkqwertyuiop123456').issues
    ).toBeTruthy();
    expect(
      validate._parse('1234567890abcdef1234567890abcde').issues
    ).toBeTruthy();
    expect(validate._parse('abcdef&$#').issues).toBeTruthy();

    const validate2 = hash('md4');
    expect(validate2._parse('12345').issues).toBeTruthy();
    expect(
      validate2._parse('zxcvbnmasdfghjkqwertyuiop123456').issues
    ).toBeTruthy();
    expect(
      validate2._parse('1234567890abcdef1234567890abcde').issues
    ).toBeTruthy();
    expect(validate2._parse('abcdef&$#').issues).toBeTruthy();

    const validate3 = hash('sha1');
    expect(validate3._parse('1234567890abcdef12345').issues).toBeTruthy();
    expect(
      validate3._parse('1234567890abcdef1234567890abcdef1234xyz').issues
    ).toBeTruthy();
    expect(
      validate3._parse('1234567890abcdef1234567890abcdef123456789').issues
    ).toBeTruthy();
    expect(validate3._parse('abcdef&$#').issues).toBeTruthy();

    const validate4 = hash('sha256');
    expect(
      validate4._parse(
        'abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789'
      ).issues
    ).toBeTruthy();
    expect(
      validate4._parse(
        'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefg'
      ).issues
    ).toBeTruthy();
    expect(
      validate4._parse(
        'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890xyz'
      ).issues
    ).toBeTruthy();
    expect(validate4._parse('abcdef&$#').issues).toBeTruthy();
    expect(validate4._parse('abcdef&$#').issues).toBeTruthy();

    const validate5 = hash('sha384');
    expect(validate5._parse('abcd').issues).toBeTruthy();
    expect(
      validate5._parse(
        'abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd'
      ).issues
    ).toBeTruthy();
    expect(
      validate5._parse(
        'abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd123'
      ).issues
    ).toBeTruthy();
    expect(validate5._parse('abcdef&$#').issues).toBeTruthy();

    const validate6 = hash('sha512');
    expect(validate6._parse('abcdef').issues).toBeTruthy();
    expect(
      validate6._parse(
        '01de2f2b94f2032e91ecc7bc6f2d5e9c6b74db6ff7b5c56eabfa3b38421a485c3f5f194a5f84e3ac7dc2b3ad4f3c3d8770444010a2336c5e0e16e7a4d58a8f02a'
      ).issues
    ).toBeTruthy();
    expect(
      validate6._parse(
        '01de2f2b94f2032e91ecc7bc6f2d5e9c6b74db6ff7b5c56eabfa3b38421a485c3f5f194a5f84e3ac7dc2b3ad4f3c3d8770444010a2336c5e0e16e7a4d58a8f02g'
      ).issues
    ).toBeTruthy();
    expect(validate6._parse('abcdef&$#').issues).toBeTruthy();

    const validate7 = hash('crc32');
    expect(validate7._parse('12345').issues).toBeTruthy();
    expect(validate7._parse('3df4b6729').issues).toBeTruthy();
    expect(validate7._parse('3df4b67z').issues).toBeTruthy();
    expect(validate7._parse('3df4b67%').issues).toBeTruthy();
    expect(validate7._parse('abcdef&$#').issues).toBeTruthy();

    const validate8 = hash('adler32');
    expect(validate8._parse('12345').issues).toBeTruthy();
    expect(validate8._parse('3df4b6729').issues).toBeTruthy();
    expect(validate8._parse('3df4b67z').issues).toBeTruthy();
    expect(validate8._parse('3df4b67z%$').issues).toBeTruthy();
    expect(validate8._parse('abcdef&$#').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not a sha1 hash!';
    const validate = hash('sha1', error);
    expect(validate._parse('sdsds').issues?.[0].message).toBe(error);
  });
});
