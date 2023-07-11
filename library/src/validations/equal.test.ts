import { describe, expect, test } from 'vitest';
import { equal } from './equal';

describe('equal', () => {
  const info = { reason: 'any' as const };

  test('should pass only equal values', () => {
    const validate1 = equal('abc');
    const value1 = 'abc';
    expect(validate1(value1, info)).toBe(value1);
    expect(() => validate1('', info)).toThrowError();
    expect(() => validate1('abc ', info)).toThrowError();
    expect(() => validate1('1abc', info)).toThrowError();

    const validate2 = equal(123);
    const value2 = 123;
    expect(validate2(value2, info)).toBe(value2);
    expect(() => validate2(1234, info)).toThrowError();
    expect(() => validate2('123', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not equal "abc"!';
    const validate = equal('abc', error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
