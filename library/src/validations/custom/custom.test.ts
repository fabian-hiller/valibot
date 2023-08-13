import { describe, expect, test } from 'vitest';
import { custom } from './custom.ts';

describe('custom', () => {
  const info = { reason: 'any' as const };

  test('should validate by custom function', () => {
    const validate = custom<number>((input) => input > 0);
    expect(validate(1, info)).toEqual({ output: 1 });
    expect(validate(-1, info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value is not greater than 1!';
    const validate = custom<number>((input) => input > 0, error);
    expect(validate(-1, info).issues?.[0].message).toBe(error);
  });
});
