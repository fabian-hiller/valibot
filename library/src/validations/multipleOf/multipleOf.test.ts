import { describe, expect, test } from 'vitest';
import { multipleOf } from './multipleOf.ts';

describe('multipleOf', () => {
  test('should pass only multiples', () => {
    const validate = multipleOf(5);
    const value1 = 5;
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = 10;
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = 15;
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = -20;
    expect(validate._parse(value4).output).toBe(value4);

    expect(validate._parse(3).issues).toBeTruthy();
    expect(validate._parse(7).issues).toBeTruthy();
    expect(validate._parse(11).issues).toBeTruthy();
    expect(validate._parse(-14).issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not a multiple of 3!';
    const validate = multipleOf(3, error);
    expect(validate._parse(1).issues?.[0].context.message).toBe(error);
  });
});
