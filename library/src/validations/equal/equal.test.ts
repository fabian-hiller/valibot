import { describe, expect, test } from 'vitest';
import { equal } from './equal.ts';

describe('equal', () => {
  test('should pass only equal values', () => {
    const validate1 = equal('abc');
    const value1 = 'abc';
    expect(validate1(value1).output).toBe(value1);
    expect(validate1('').issues).toBeTruthy();
    expect(validate1('abc ').issues).toBeTruthy();
    expect(validate1('1abc').issues).toBeTruthy();

    const validate2 = equal(123);
    const value2 = 123;
    expect(validate2(value2).output).toBe(value2);
    expect(validate2(1234).issues).toBeTruthy();
    expect(validate2('123').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not equal "abc"!';
    const validate = equal('abc', error);
    expect(validate('test').issues?.[0].message).toBe(error);
  });
});
