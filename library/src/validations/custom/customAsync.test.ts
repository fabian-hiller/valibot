import { describe, expect, test } from 'vitest';
import { customAsync } from './customAsync.ts';

describe('customAsync', () => {
  const info = { reason: 'any' as const };

  test('should validate by custom function', async () => {
    const validate1 = customAsync<number>(async (input) => input > 0);
    expect(await validate1(1, info)).toBe(1);
    await expect(validate1(-1, info)).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not greater than 1!';
    const validate = customAsync<number>(async (input) => input > 0, error);
    await expect(validate(-1, info)).rejects.toThrowError(error);
  });
});
