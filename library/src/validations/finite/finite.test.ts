import { describe, expect, test } from 'vitest';
import { finite } from './finite.ts';

describe('finite', () => {
  test('should pass only a finite number', () => {
    const validate = finite();
    const value1 = 0;
    expect(validate(value1).output).toBe(value1);
    const value2 = 1;
    expect(validate(value2).output).toBe(value2);
    const value3 = -1;
    expect(validate(value3).output).toBe(value3);
    const value4 = 3.14;
    expect(validate(value4).output).toBe(value4);

    expect(validate(NaN).issue).toBeTruthy();
    expect(validate(Infinity).issue).toBeTruthy();
    expect(validate(-Infinity).issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not a finite number!';
    const validate = finite(error);
    expect(validate(Infinity).issue?.message).toBe(error);
  });
});
