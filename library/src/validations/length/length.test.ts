import { describe, expect, test } from 'vitest';
import { length } from './length.ts';

describe('length', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid lengths', () => {
    const validate = length(3);
    const value1 = '123';
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = [1, 2, 3];
    expect(validate(value2, info)).toEqual({ output: value2 });

    expect(validate('', info).issues?.length).toBe(1);
    expect(validate('12', info).issues?.length).toBe(1);
    expect(validate('1234', info).issues?.length).toBe(1);
    expect(validate([1, 2], info).issues?.length).toBe(1);
    expect(validate([1, 2, 3, 4], info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value length is not "10"!';
    const validate = length(10, error);
    expect(validate('test', info).issues?.[0].message).toBe(error);
  });
});
