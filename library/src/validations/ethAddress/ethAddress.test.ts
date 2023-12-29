import { describe, expect, test } from 'vitest';
import { ethAddress } from './ethAddress.ts';

describe('ethAddress', () => {
  test('should pass valid ethereum addresses', () => {
    const validate = ethAddress();

    const value1 = '0x0000000000000000000000000000000000000001';
    expect(validate._parse(value1).output).toBe(value1);

    const value2 = '0x683E07492fBDfDA84457C16546ac3f433BFaa128';
    expect(validate._parse(value2).output).toBe(value2);

    const value3 = '0x88dA6B6a8D3590e88E0FcadD5CEC56A7C9478319';
    expect(validate._parse(value3).output).toBe(value3);

    const value4 = '0x8a718a84ee7B1621E63E680371e0C03C417cCaF6';
    expect(validate._parse(value4).output).toBe(value4);

    const value5 = '0xFCb5AFB808b5679b4911230Aa41FfCD0cd335b42';
    expect(validate._parse(value5).output).toBe(value5);
  });

  test('should reject invalid etherum addresses', () => {
    const validate = ethAddress();

    expect(validate._parse('').issues).toBeTruthy();
    expect(
      validate._parse('1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t').issues
    ).toBeTruthy();
    expect(
      validate._parse('0xabcdef1234567890abcdef1234567890abcdef12345').issues
    ).toBeTruthy();
    expect(
      validate._parse('0xabcdef1234567890abcdef1234567890abcdef1').issues
    ).toBeTruthy();
    expect(
      validate._parse('0xGHIJKL1234567890MNOPQR1234567890STUVWXYZ').issues
    ).toBeTruthy();
    expect(
      validate._parse('0x1234567890abcdef1234567890abcdef12345xyz').issues
    ).toBeTruthy();
    expect(
      validate._parse('0b0110100001100101011011000110110001101111').issues
    ).toBeTruthy();
    expect(
      validate._parse('1C6o5CDkLxjsVpnLSuqRs1UBFozXLEwYvU').issues
    ).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not a valid Ethereum address!';
    const validate = ethAddress(error);
    expect(validate._parse('').issues?.[0].message).toBe(error);
  });
});
