import { describe, expect, test } from 'vitest';
import { length } from './length.ts';

describe('length', () => {
  test('should pass only valid lengths', () => {
    const validate = length(3);

    const value1 = '123';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = [1, 2, 3];
    expect(validate._parse(value2).output).toBe(value2);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('12').issues).toBeTruthy();
    expect(validate._parse('1234').issues).toBeTruthy();
    expect(validate._parse([1, 2]).issues).toBeTruthy();
    expect(validate._parse([1, 2, 3, 4]).issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value length is not "10"!';
    const validate = length(10, error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
