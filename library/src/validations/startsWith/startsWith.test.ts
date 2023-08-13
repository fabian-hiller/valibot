import { describe, expect, test } from 'vitest';
import { startsWith } from './startsWith.ts';

describe('startsWith', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid strings', () => {
    const validate = startsWith('abc');
    const value1 = 'abc';
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = 'abc123';
    expect(validate(value2, info)).toEqual({ output: value2 });

    expect(validate(' ', info).issues?.length).toBe(1);
    expect(validate(' abc', info).issues?.length).toBe(1);
    expect(validate('1abc', info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value does not start with "abc"!';
    const validate = startsWith('abc', error);
    expect(validate('test', info).issues?.[0].message).toBe(error);
  });
});
