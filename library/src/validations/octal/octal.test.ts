import { describe, expect, test } from 'vitest';
import { octal } from './octal.ts';

describe('octal', () => {
  test('should pass only valid strings', () => {
    const validate = octal();
    const value = '123';
    expect(validate._parse(value).output).toBe(value);

    const value2 = '001';
    expect(validate._parse(value2).output).toBe(value2);

    const value3 = '765';
    expect(validate._parse(value3).output).toBe(value3);

    const value4 = '000';
    expect(validate._parse(value4).output).toBe(value4);

    const value5 = '111';
    expect(validate._parse(value5).output).toBe(value5);

    const value6 = '020';
    expect(validate._parse(value6).output).toBe(value6);

    const value7 = '707';
    expect(validate._parse(value7).output).toBe(value7);

    const value8 = '00012345';
    expect(validate._parse(value8).output).toBe(value8);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('8').issues).toBeTruthy();
    expect(validate._parse('9').issues).toBeTruthy();
    expect(validate._parse('789').issues).toBeTruthy();
    expect(validate._parse('1238').issues).toBeTruthy();
    expect(validate._parse('abc').issues).toBeTruthy();
    expect(validate._parse('0123456789').issues).toBeTruthy();
    expect(validate._parse('0078').issues).toBeTruthy();
    expect(validate._parse('056A').issues).toBeTruthy();
    expect(validate._parse('99').issues).toBeTruthy();
    expect(validate._parse('08').issues).toBeTruthy();
    expect(validate._parse('%123').issues).toBeTruthy();
    expect(validate._parse('00o123').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value does not match the octal!';
    const validate = octal(error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
