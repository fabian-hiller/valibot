import { describe, expect, test } from 'vitest';
import { value } from './value.ts';

describe('value', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid values', () => {
    const validate1 = value(3);
    const value1 = 3;
    expect(validate1(value1, info)).toEqual({ output: value1 });

    const validate2 = value('test');
    const value2 = 'test';
    expect(validate2(value2, info)).toEqual({ output: value2 });

    expect(validate1(2, info).issues?.length).toBe(1);

    expect(validate1(2, info).issues?.length).toBe(1);
    expect(validate1(4, info).issues?.length).toBe(1);
    expect(validate2('tes', info).issues?.length).toBe(1);
    expect(validate2('testx', info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value is not "10"!';
    const validate = value(10, error);
    expect(validate(123, info).issues?.[0].message).toBe(error);
  });
});
