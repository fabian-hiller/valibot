import { describe, expect, test } from 'vitest';
import { endsWith } from './endsWith.ts';

describe('endsWith', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid strings', () => {
    const validate = endsWith('abc');
    const value1 = 'abc';
    expect(validate(value1, info)).toBe(value1);
    const value2 = '123abc';
    expect(validate(value2, info)).toBe(value2);

    expect(() => validate(' ', info)).toThrowError();
    expect(() => validate('abc ', info)).toThrowError();
    expect(() => validate('abcd', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value does not end with "abc"!';
    const validate = endsWith('abc', error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
