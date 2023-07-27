import { describe, expect, test } from 'vitest';
import { startsWith } from './startsWith.ts';

describe('startsWith', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid strings', () => {
    const validate = startsWith('abc');
    const value1 = 'abc';
    expect(validate(value1, info)).toBe(value1);
    const value2 = 'abc123';
    expect(validate(value2, info)).toBe(value2);

    expect(() => validate(' ', info)).toThrowError();
    expect(() => validate(' abc', info)).toThrowError();
    expect(() => validate('1abc', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value does not start with "abc"!';
    const validate = startsWith('abc', error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
