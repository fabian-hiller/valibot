import { describe, expect, test } from 'vitest';
import { integer } from './integer.ts';

describe('integer', () => {
  const info = { reason: 'any' as const };

  test('should pass only integer', () => {
    const validate = integer();
    const value1 = 0;
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = 1;
    expect(validate(value2, info)).toEqual({ output: value2 });
    const value3 = 9007199254740992;
    expect(validate(value3, info)).toEqual({ output: value3 });
    const value4 = Number.MAX_SAFE_INTEGER;
    expect(validate(value4, info)).toEqual({ output: value4 });
    const value5 = Number.MIN_SAFE_INTEGER;
    expect(validate(value5, info)).toEqual({ output: value5 });

    expect(validate(5.5, info).issues?.length).toBe(1);
    expect(validate(0.000001, info).issues?.length).toBe(1);
    expect(validate(-3.14, info).issues?.length).toBe(1);
    expect(validate(NaN, info).issues?.length).toBe(1);
    expect(validate(Infinity, info).issues?.length).toBe(1);
    expect(validate(-Infinity, info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value is not an integer!';
    const validate = integer(error);
    expect(validate(3.14, info).issues?.[0].message).toBe(error);
  });
});
