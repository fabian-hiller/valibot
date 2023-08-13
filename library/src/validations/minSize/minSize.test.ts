import { describe, expect, test } from 'vitest';
import { minSize } from './minSize.ts';

describe('minSize', () => {
  const info = { reason: 'any' as const };

  test('should pass only valid sizes', () => {
    const validate = minSize(2);

    const value1 = new Map().set(1, 1).set(2, 2);
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = value1.set(3, 3);
    expect(validate(value2, info)).toEqual({ output: value2 });
    const value3 = new Set().add(1).add(2);
    expect(validate(value3, info)).toEqual({ output: value3 });
    const value4 = value3.add(3);
    expect(validate(value4, info)).toEqual({ output: value4 });

    expect(validate(new Map(), info).issues?.length).toBe(1);
    expect(validate(new Set(), info).issues?.length).toBe(1);
    expect(validate(new Set().add(1), info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value size is less than "2"!';
    const value = new Set().add(1);
    const validate = minSize(2, error);
    expect(validate(value, info).issues?.[0].message).toBe(error);
  });
});
