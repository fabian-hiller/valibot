import { describe, expect, test } from 'vitest';
import { safeInteger } from './safeInteger.ts';

describe('safeInteger', () => {
  test('should pass only safe integer', () => {
    const validate = safeInteger();
    const value1 = 0;
    expect(validate(value1).output).toBe(value1);
    const value2 = 1;
    expect(validate(value2).output).toBe(value2);
    const value3 = -1;
    expect(validate(value3).output).toBe(value3);
    const value4 = Number.MAX_SAFE_INTEGER;
    expect(validate(value4).output).toBe(value4);
    const value5 = Number.MIN_SAFE_INTEGER;
    expect(validate(value5).output).toBe(value5);

    expect(validate(Number.MAX_SAFE_INTEGER + 1).issue).toBeTruthy();
    expect(validate(Number.MIN_SAFE_INTEGER - 1).issue).toBeTruthy();
    expect(validate(3.14).issue).toBeTruthy();
    expect(validate(NaN).issue).toBeTruthy();
    expect(validate(Infinity).issue).toBeTruthy();
    expect(validate(-Infinity).issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not a safe integer!';
    const validate = safeInteger(error);
    expect(validate(Infinity).issue?.message).toBe(error);
  });
});
