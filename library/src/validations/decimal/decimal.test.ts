import { describe, expect, test } from 'vitest';
import { decimal } from './decimal.ts';

describe('decimal', () => {
  test('should pass only decimal strings', () => {
    const validate = decimal();

    const value1 = '0';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '9';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = '123456789';
    expect(validate._parse(value3).output).toBe(value3);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('0a').issues).toBeTruthy();
    expect(validate._parse('0 0').issues).toBeTruthy();
    expect(validate._parse('12345f').issues).toBeTruthy();
    expect(validate._parse('#FFAABB').issues).toBeTruthy();
    expect(validate._parse('XYZ123').issues).toBeTruthy();
    expect(validate._parse('hello!').issues).toBeTruthy();
    expect(validate._parse('11 22 33').issues).toBeTruthy();
    expect(validate._parse('7G5H').issues).toBeTruthy();
    expect(validate._parse('!@#$%^').issues).toBeTruthy();
    expect(validate._parse('abc123xyz').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not decimal string!';
    const validate = decimal(error);
    expect(validate._parse('1G').issues?.[0].context.message).toBe(error);
  });
});
