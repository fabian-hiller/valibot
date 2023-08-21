import { describe, expect, test } from 'vitest';
import { equal } from './equal.ts';

describe('equal', () => {
  test('should pass only equal values', () => {
    const validate1 = equal('abc');
    const value1 = 'abc';
    expect(validate1(value1).output).toBe(value1);
    expect(validate1('').issue).toBeTruthy();
    expect(validate1('abc ').issue).toBeTruthy();
    expect(validate1('1abc').issue).toBeTruthy();

    const validate2 = equal(123);
    const value2 = 123;
    expect(validate2(value2).output).toBe(value2);
    expect(validate2(1234).issue).toBeTruthy();
    expect(validate2('123').issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not equal "abc"!';
    const validate = equal('abc', error);
    expect(validate('test').issue?.message).toBe(error);
  });
});
