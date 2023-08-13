import { describe, expect, test } from 'vitest';
import { minLength } from './minLength.ts';

describe('minLength', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid lengths', () => {
    const validate = minLength(3);

    const value1 = '123';
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = '123456789';
    expect(validate(value2, info)).toEqual({ output: value2 });
    const value3 = [1, 2, 3];
    expect(validate(value3, info)).toEqual({ output: value3 });

    expect(validate('', info).issues?.length).toBe(1);
    expect(validate('12', info).issues?.length).toBe(1);
    expect(validate([], info).issues?.length).toBe(1);
    expect(validate([1, 2], info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value length is less than "3"!';
    const validate = minLength(3, error);
    expect(validate('1', info).issues?.[0].message).toBe(error);
  });
});
