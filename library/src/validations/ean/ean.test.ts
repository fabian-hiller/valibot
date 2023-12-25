import { describe, expect, test } from 'vitest';
import { ean } from './ean.ts';

describe('ean', () => {
  test('should pass only valid EAN', () => {
    const validate = ean();

    const value1 = '73513537';
    expect(validate._parse(value1).output).toBe(value1);

    const value2 = '96385074';
    expect(validate._parse(value2).output).toBe(value2);

    const value3 = '40267708';
    expect(validate._parse(value3).output).toBe(value3);

    const value4 = '9421023610112';
    expect(validate._parse(value4).output).toBe(value4);

    const value5 = '1234567890128';
    expect(validate._parse(value5).output).toBe(value5);

    const value6 = '4012345678901';
    expect(validate._parse(value6).output).toBe(value6);

    const value7 = '9771234567003';
    expect(validate._parse(value7).output).toBe(value7);

    const value8 = '9310779300005';
    expect(validate._parse(value8).output).toBe(value8);

    const value9 = '12345678901231';
    expect(validate._parse(value9).output).toBe(value9);

    const value10 = '00012345600012';
    expect(validate._parse(value10).output).toBe(value10);

    const value11 = '10012345678902';
    expect(validate._parse(value11).output).toBe(value11);

    const value12 = '20012345678909';
    expect(validate._parse(value12).output).toBe(value12);
  });

  test('should reject invalid EAN', () => {
    const validate = ean();

    // Empty string or special characters
    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('4026770%').issues).toBeTruthy();

    // Invalid EAN-8 codes
    expect(validate._parse('12345678').issues).toBeTruthy();
    expect(validate._parse('87654321').issues).toBeTruthy();
    expect(validate._parse('96385075').issues).toBeTruthy();

    // Invalid EAN-13 codes
    expect(validate._parse('4003994155487').issues).toBeTruthy();
    expect(validate._parse('9780201379625').issues).toBeTruthy();
    expect(validate._parse('5010019640264').issues).toBeTruthy();

    // Invalid EAN-14 codes
    expect(validate._parse('12345678901232').issues).toBeTruthy();
    expect(validate._parse('98765432109875').issues).toBeTruthy();
    expect(validate._parse('10012345678903').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is invalid EAN!';
    const validate = ean(error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
