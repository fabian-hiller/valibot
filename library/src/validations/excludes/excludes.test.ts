import { describe, expect, test } from 'vitest';
import { excludes } from './excludes.ts';

describe('excludes', () => {
  test('should pass only excluded values', () => {
    const validate = excludes('abc');
    const value1 = '';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = 'bcdefg';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = 'abdefg';
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = 'ABC';
    expect(validate._parse(value4).output).toBe(value4);
    const value5 = 'aBc';
    expect(validate._parse(value5).output).toBe(value5);

    expect(validate._parse('abc').issues).toBeTruthy();
    expect(validate._parse('abcdefg').issues).toBeTruthy();
    expect(validate._parse('123abc').issues).toBeTruthy();
    expect(validate._parse('abcabc').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value does not exclude "abc"!';
    const validate = excludes('abc', error);
    expect(validate._parse('abc').issues?.[0].message).toBe(error);
  });
});
