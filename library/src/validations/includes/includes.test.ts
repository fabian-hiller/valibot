import { describe, expect, test } from 'vitest';
import { includes } from './includes.ts';

describe('includes', () => {
  const info = { reason: 'any' as const };

  test('should pass only included values', () => {
    const validate = includes('abc');
    const value1 = 'abc';
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = '123abc';
    expect(validate(value2, info)).toEqual({ output: value2 });
    const value3 = '123abc123';
    expect(validate(value3, info)).toEqual({ output: value3 });

    expect(validate('', info).issues?.length).toBe(1);
    expect(validate('Abc', info).issues?.length).toBe(1);
    expect(validate('123', info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value does not include "abc"!';
    const validate = includes('abc', error);
    expect(validate('test', info).issues?.[0].message).toBe(error);
  });
});
