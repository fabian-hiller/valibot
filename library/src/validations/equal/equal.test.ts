import { describe, expect, test } from 'vitest';
import { equal } from './equal.ts';

describe('equal', () => {
  test('should pass only equal values', () => {
    const validate1 = equal('abc');
    const value1 = 'abc';
    expect(validate1._parse(value1).output).toBe(value1);
    expect(validate1._parse('').issues).toBeTruthy();
    expect(validate1._parse('abc ').issues).toBeTruthy();
    expect(validate1._parse('1abc').issues).toBeTruthy();

    const validate2 = equal(123);
    const value2 = 123;
    expect(validate2._parse(value2).output).toBe(value2);
    expect(validate2._parse(1234).issues).toBeTruthy();
    expect(validate2._parse('123').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not equal "abc"!';
    const validate = equal('abc', error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
