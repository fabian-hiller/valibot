import { describe, expect, test } from 'vitest';
import { some } from './some.ts';

describe('some', () => {
  test('should validate by some function', () => {
    const validate = some<number[]>((input) => input > 9);
    expect(validate._parse([1, 5, 10]).output).toEqual([1, 5, 10]);
    expect(validate._parse([1, 5]).issues).toBeTruthy();
  });

  test('should return some error message', () => {
    const error = 'No item is greater than 1!';
    const validate = some<number[]>((input) => input > 0, error);
    expect(validate._parse([-1]).issues?.[0].context.message).toBe(error);
  });
});
