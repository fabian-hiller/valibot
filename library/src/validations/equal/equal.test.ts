import { describe, expect, test } from 'vitest';
import { equal } from './equal.ts';

describe('equal', () => {
  const info = { reason: 'any' as const };

  test('should pass only equal values', () => {
    const validate1 = equal('abc');
    const value1 = 'abc';
    expect(validate1(value1, info)).toEqual({ output: value1 });
    expect(validate1('', info).issues?.length).toBe(1);
    expect(validate1('abc ', info).issues?.length).toBe(1);
    expect(validate1('1abc', info).issues?.length).toBe(1);

    const validate2 = equal(123);
    const value2 = 123;
    expect(validate2(value2, info)).toEqual({ output: value2 });
    expect(validate2(1234, info).issues?.length).toBe(1);
    expect(validate2('123', info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value is not equal "abc"!';
    const validate = equal('abc', error);
    expect(validate('test', info).issues?.[0].message).toBe(error);
  });
});
