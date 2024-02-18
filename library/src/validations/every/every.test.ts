import { describe, expect, test } from 'vitest';
import { every } from './every.ts';

describe('every', () => {
  test('should validate by every function', () => {
    const validate = every<number[]>((input) => input > 9);
    expect(validate._parse([10, 20, 30]).output).toEqual([10, 20, 30]);
    expect(validate._parse([0, 10, 20]).issues).toBeTruthy();
  });

  test('should return every error message', () => {
    const error = 'No every item is greater than 1!';
    const validate = every<number[]>((input) => input > 0, error);
    expect(validate._parse([1, 34, -1, 5]).issues?.[0].context.message).toBe(
      error
    );
  });
});
