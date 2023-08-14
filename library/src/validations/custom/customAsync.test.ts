import { describe, expect, test } from 'vitest';
import { customAsync } from './customAsync.ts';

describe('customAsync', () => {
  const info = { reason: 'any' as const };

  test('should validate by custom function', async () => {
    const validate1 = customAsync<number>(async (input) => input > 0);
    expect(await validate1(1, info)).toEqual({ output: 1 });
    expect((await validate1(-1, info)).issues?.length).toBe(1);
  });

  test('should return custom error message', async () => {
    const error = 'Value is not greater than 1!';
    const validate = customAsync<number>(async (input) => input > 0, error);
    expect((await validate(-1, info)).issues?.[0].message).toBe(error);
  });
});
