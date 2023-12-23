import { describe, expect, test } from 'vitest';
import { hex } from './hex.ts';

describe('hex', () => {
  test('should pass only hexadecimal strings', () => {
    const validate = hex();
    const value1 = '1A3F';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '00ff';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = '7B2C';
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = 'F00D';
    expect(validate._parse(value4).output).toBe(value4);
    const value5 = 'abc123';
    expect(validate._parse(value5).output).toBe(value5);
    const value6 = '123ABC';
    expect(validate._parse(value6).output).toBe(value6);
    const value7 = '000000';
    expect(validate._parse(value7).output).toBe(value7);
    const value8 = 'FFFFFF';
    expect(validate._parse(value8).output).toBe(value8);
    const value9 = '0a1b2c';
    expect(validate._parse(value9).output).toBe(value9);
    const value10 = 'deadBEEF';
    expect(validate._parse(value10).output).toBe(value10);
    const value11 = '0x0123456789abcDEF';
    expect(validate._parse(value11).output).toBe(value11);
    const value12 = '0HfedCBA9876543210';
    expect(validate._parse(value12).output).toBe(value12);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('1G4Z').issues).toBeTruthy();
    expect(validate._parse('12345G').issues).toBeTruthy();
    expect(validate._parse('#FFAABB').issues).toBeTruthy();
    expect(validate._parse('XYZ123').issues).toBeTruthy();
    expect(validate._parse('hello!').issues).toBeTruthy();
    expect(validate._parse('11 22 33').issues).toBeTruthy();
    expect(validate._parse('7G5H').issues).toBeTruthy();
    expect(validate._parse('!@#$%^').issues).toBeTruthy();
    expect(validate._parse('abc123xyz').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not hexadecimal string!';
    const validate = hex(error);
    expect(validate._parse('1G').issues?.[0].message).toBe(error);
  });
});
