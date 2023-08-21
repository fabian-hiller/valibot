import { describe, expect, test } from 'vitest';
import { integer } from './integer.ts';

describe('integer', () => {
  test('should pass only integer', () => {
    const validate = integer();
    const value1 = 0;
    expect(validate(value1).output).toBe(value1);
    const value2 = 1;
    expect(validate(value2).output).toBe(value2);
    const value3 = 9007199254740992;
    expect(validate(value3).output).toBe(value3);
    const value4 = Number.MAX_SAFE_INTEGER;
    expect(validate(value4).output).toBe(value4);
    const value5 = Number.MIN_SAFE_INTEGER;
    expect(validate(value5).output).toBe(value5);

    expect(validate(5.5).issue).toBeTruthy();
    expect(validate(0.000001).issue).toBeTruthy();
    expect(validate(-3.14).issue).toBeTruthy();
    expect(validate(NaN).issue).toBeTruthy();
    expect(validate(Infinity).issue).toBeTruthy();
    expect(validate(-Infinity).issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an integer!';
    const validate = integer(error);
    expect(validate(3.14).issue?.message).toBe(error);
  });
});
