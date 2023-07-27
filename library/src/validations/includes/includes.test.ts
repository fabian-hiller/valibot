import { describe, expect, test } from 'vitest';
import { includes } from './includes.ts';

describe('includes', () => {
  const info = { reason: 'any' as const };

  test('should pass only included values', () => {
    const validate = includes('abc');
    const value1 = 'abc';
    expect(validate(value1, info)).toBe(value1);
    const value2 = '123abc';
    expect(validate(value2, info)).toBe(value2);
    const value3 = '123abc123';
    expect(validate(value3, info)).toBe(value3);

    expect(() => validate('', info)).toThrowError();
    expect(() => validate('Abc', info)).toThrowError();
    expect(() => validate('123', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value does not include "abc"!';
    const validate = includes('abc', error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
