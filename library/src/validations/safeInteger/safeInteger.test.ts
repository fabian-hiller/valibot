import { describe, expect, test } from 'vitest';
import { safeInteger } from './safeInteger.ts';

describe('safeInteger', () => {
  const info = { reason: 'any' as const };

  test('should pass only safe integer', () => {
    const validate = safeInteger();
    const value1 = 0;
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = 1;
    expect(validate(value2, info)).toEqual({ output: value2 });
    const value3 = -1;
    expect(validate(value3, info)).toEqual({ output: value3 });
    const value4 = Number.MAX_SAFE_INTEGER;
    expect(validate(value4, info)).toEqual({ output: value4 });
    const value5 = Number.MIN_SAFE_INTEGER;
    expect(validate(value5, info)).toEqual({ output: value5 });

    expect(validate(Number.MAX_SAFE_INTEGER + 1, info).issues?.length).toBe(1);
    expect(validate(Number.MIN_SAFE_INTEGER - 1, info).issues?.length).toBe(1);
    expect(validate(3.14, info).issues?.length).toBe(1);
    expect(validate(NaN, info).issues?.length).toBe(1);
    expect(validate(Infinity, info).issues?.length).toBe(1);
    expect(validate(-Infinity, info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value is not a safe integer!';
    const validate = safeInteger(error);
    expect(validate(Infinity, info).issues?.[0].message).toBe(error);
  });
});
