import { describe, expect, test } from 'vitest';
import { minSize } from './minSize.ts';

describe('minSize', () => {
  test('should pass only valid sizes', () => {
    const validate = minSize(2);

    const value1 = new Map().set(1, 1).set(2, 2);
    expect(validate(value1).output).toBe(value1);
    const value2 = value1.set(3, 3);
    expect(validate(value2).output).toBe(value2);
    const value3 = new Set().add(1).add(2);
    expect(validate(value3).output).toBe(value3);
    const value4 = value3.add(3);
    expect(validate(value4).output).toBe(value4);

    expect(validate(new Map()).issues).toBeTruthy();
    expect(validate(new Set()).issues).toBeTruthy();
    expect(validate(new Set().add(1)).issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value size is less than "2"!';
    const value = new Set().add(1);
    const validate = minSize(2, error);
    expect(validate(value).issues?.[0].message).toBe(error);
  });
});
