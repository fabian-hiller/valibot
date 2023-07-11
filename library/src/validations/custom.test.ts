import { describe, expect, test } from 'vitest';
import { custom } from './custom';

describe('custom', () => {
  const info = { reason: 'any' as const };

  test('should validate by custom function', () => {
    const validate = custom<number>((input) => input > 0);
    expect(validate(1, info)).toBe(1);
    expect(() => validate(-1, info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not greater than 1!';
    const validate = custom<number>((input) => input > 0, error);
    expect(() => validate(-1, info)).toThrowError(error);
  });
});
