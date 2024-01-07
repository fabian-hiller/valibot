import { describe, expect, test } from 'vitest';
import { issn } from './issn.ts';

describe('issn', () => {
  test('should pass only valid ISSN', () => {
    const validate = issn();

    const value1 = '2049-3630';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '0317-8471';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = '0378-5955';
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = '2434-561X';
    expect(validate._parse(value4).output).toBe(value4);
    const value5 = '2434-561x';
    expect(validate._parse(value5).output).toBe(value5);
    const value6 = '1037-6178';
    expect(validate._parse(value6).output).toBe(value6);
    const value7 = '01896016';
    expect(validate._parse(value7).output).toBe(value7);
    const value8 = '20905076';
    expect(validate._parse(value8).output).toBe(value8);
  });

  test('should reject invalid ISSN', () => {
    const validate = issn();

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('0000-0000').issues).toBeTruthy();
    expect(validate._parse('1234-5678').issues).toBeTruthy();
    expect(validate._parse('abcd-efgh').issues).toBeTruthy();
    expect(validate._parse('1234-567A').issues).toBeTruthy();
    expect(validate._parse('1234-567X').issues).toBeTruthy();
    expect(validate._parse('0').issues).toBeTruthy();
    expect(validate._parse('2434-561c').issues).toBeTruthy();
    expect(validate._parse('1684-5370').issues).toBeTruthy();
    expect(validate._parse('19960791').issues).toBeTruthy();
    expect(validate._parse('2090507&').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an ISSN!';
    const validate = issn(error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
