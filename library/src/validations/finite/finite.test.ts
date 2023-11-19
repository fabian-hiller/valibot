import { describe, expect, test } from 'vitest';
import { finite } from './finite.ts';

describe('finite', () => {
  test('should pass only a finite number', () => {
    const validate = finite();
    const value1 = 0;
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = 1;
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = -1;
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = 3.14;
    expect(validate._parse(value4).output).toBe(value4);

    expect(validate._parse(NaN).issues).toBeTruthy();
    expect(validate._parse(Infinity).issues).toBeTruthy();
    expect(validate._parse(-Infinity).issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not a finite number!';
    const validate = finite(error);
    expect(validate._parse(Infinity).issues?.[0].message).toBe(error);
  });
});
