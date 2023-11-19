import { describe, expect, test } from 'vitest';
import { safeInteger } from './safeInteger.ts';

describe('safeInteger', () => {
  test('should pass only safe integer', () => {
    const validate = safeInteger();
    const value1 = 0;
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = 1;
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = -1;
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = Number.MAX_SAFE_INTEGER;
    expect(validate._parse(value4).output).toBe(value4);
    const value5 = Number.MIN_SAFE_INTEGER;
    expect(validate._parse(value5).output).toBe(value5);

    expect(validate._parse(Number.MAX_SAFE_INTEGER + 1).issues).toBeTruthy();
    expect(validate._parse(Number.MIN_SAFE_INTEGER - 1).issues).toBeTruthy();
    expect(validate._parse(3.14).issues).toBeTruthy();
    expect(validate._parse(NaN).issues).toBeTruthy();
    expect(validate._parse(Infinity).issues).toBeTruthy();
    expect(validate._parse(-Infinity).issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not a safe integer!';
    const validate = safeInteger(error);
    expect(validate._parse(Infinity).issues?.[0].message).toBe(error);
  });
});
