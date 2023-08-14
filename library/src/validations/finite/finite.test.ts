import { describe, expect, test } from 'vitest';
import { finite } from './finite.ts';

describe('finite', () => {
  const info = { reason: 'any' as const };

  test('should pass only a finite number', () => {
    const validate = finite();
    const value1 = 0;
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = 1;
    expect(validate(value2, info)).toEqual({ output: value2 });
    const value3 = -1;
    expect(validate(value3, info)).toEqual({ output: value3 });
    const value4 = 3.14;
    expect(validate(value4, info)).toEqual({ output: value4 });

    expect(validate(NaN, info).issues?.length).toBe(1);
    expect(validate(Infinity, info).issues?.length).toBe(1);
    expect(validate(-Infinity, info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value is not a finite number!';
    const validate = finite(error);
    expect(validate(Infinity, info).issues?.[0].message).toBe(error);
  });
});
