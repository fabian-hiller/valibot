import { describe, expect, test } from 'vitest';
import { custom } from './custom.ts';

describe('custom', () => {
  test('should validate by custom function', () => {
    const validate = custom<number>((input) => input > 0);
    expect(validate._parse(1).output).toBe(1);
    expect(validate._parse(-1).issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not greater than 1!';
    const validate = custom<number>((input) => input > 0, error);
    expect(validate._parse(-1).issues?.[0].context.message).toBe(error);
  });

  test('should return custom error message including input value', () => {
    const val = -1;
    const error = `provided value is : ${val}`;
    const validate = custom<number>((input) => input > 0, undefined, (input) => `provided value is : ${input}`);
    expect(validate._parse(val).issues?.[0].context.message).toBe(error);
  })
});
