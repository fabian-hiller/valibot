import { describe, expect, test } from 'vitest';
import { minLength } from './minLength.ts';

describe('minLength', () => {
  test('should pass only valid lengths', () => {
    const validate = minLength(3);

    const value1 = '123';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '123456789';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = [1, 2, 3];
    expect(validate._parse(value3).output).toBe(value3);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('12').issues).toBeTruthy();
    expect(validate._parse([]).issues).toBeTruthy();
    expect(validate._parse([1, 2]).issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value length is less than "3"!';
    const validate = minLength(3, error);
    expect(validate._parse('1').issues?.[0].context.message).toBe(error);
  });
});
