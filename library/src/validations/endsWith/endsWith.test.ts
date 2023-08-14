import { describe, expect, test } from 'vitest';
import { endsWith } from './endsWith.ts';

describe('endsWith', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid strings', () => {
    const validate = endsWith('abc');
    const value1 = 'abc';
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = '123abc';
    expect(validate(value2, info)).toEqual({ output: value2 });

    expect(validate(' ', info).issues?.length).toBe(1);
    expect(validate('abc ', info).issues?.length).toBe(1);
    expect(validate('abcd', info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value does not end with "abc"!';
    const validate = endsWith('abc', error);
    expect(validate('test', info).issues?.[0].message).toBe(error);
  });
});
