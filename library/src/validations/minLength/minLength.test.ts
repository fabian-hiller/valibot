import { describe, expect, test } from 'vitest';
import { minLength } from './minLength.ts';

describe('minLength', () => {
  test('should pass only valid lengths', () => {
    const validate = minLength(3);

    const value1 = '123';
    expect(validate(value1).output).toBe(value1);
    const value2 = '123456789';
    expect(validate(value2).output).toBe(value2);
    const value3 = [1, 2, 3];
    expect(validate(value3).output).toBe(value3);

    expect(validate('').issue).toBeTruthy();
    expect(validate('12').issue).toBeTruthy();
    expect(validate([]).issue).toBeTruthy();
    expect(validate([1, 2]).issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value length is less than "3"!';
    const validate = minLength(3, error);
    expect(validate('1').issue?.message).toBe(error);
  });
});
