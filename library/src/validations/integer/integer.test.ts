import { describe, expect, test } from 'vitest';
import { integer } from './integer.ts';

describe('integer', () => {
  test('should pass only integer', () => {
    const validate = integer();
    const value1 = 0;
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = 1;
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = 9007199254740992;
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = Number.MAX_SAFE_INTEGER;
    expect(validate._parse(value4).output).toBe(value4);
    const value5 = Number.MIN_SAFE_INTEGER;
    expect(validate._parse(value5).output).toBe(value5);

    expect(validate._parse(5.5).issues).toBeTruthy();
    expect(validate._parse(0.000001).issues).toBeTruthy();
    expect(validate._parse(-3.14).issues).toBeTruthy();
    expect(validate._parse(NaN).issues).toBeTruthy();
    expect(validate._parse(Infinity).issues).toBeTruthy();
    expect(validate._parse(-Infinity).issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an integer!';
    const validate = integer(error);
    expect(validate._parse(3.14).issues?.[0].context.message).toBe(error);
  });
});
