import { describe, expect, test } from 'vitest';
import { excludes } from './excludes.ts';

describe('excludes', () => {
  test('should pass only excluded values', () => {
    const validate = excludes('abc');
    const value1 = '';
    expect(validate(value1).output).toBe(value1);
    const value2 = 'bcdefg';
    expect(validate(value2).output).toBe(value2);
    const value3 = 'abdefg';
    expect(validate(value3).output).toBe(value3);
    const value4 = 'ABC';
    expect(validate(value4).output).toBe(value4);
    const value5 = 'aBc';
    expect(validate(value5).output).toBe(value5);

    expect(validate('abc').issue).toBeTruthy();
    expect(validate('abcdefg').issue).toBeTruthy();
    expect(validate('123abc').issue).toBeTruthy();
    expect(validate('abcabc').issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value does not exclude "abc"!';
    const validate = excludes('abc', error);
    expect(validate('abc').issue?.message).toBe(error);
  });
});
