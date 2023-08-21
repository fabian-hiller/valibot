import { describe, expect, test } from 'vitest';
import { length } from './length.ts';

describe('length', () => {
  test('should pass only valid lengths', () => {
    const validate = length(3);
    const value1 = '123';
    expect(validate(value1).output).toBe(value1);
    const value2 = [1, 2, 3];
    expect(validate(value2).output).toBe(value2);

    expect(validate('').issue).toBeTruthy();
    expect(validate('12').issue).toBeTruthy();
    expect(validate('1234').issue).toBeTruthy();
    expect(validate([1, 2]).issue).toBeTruthy();
    expect(validate([1, 2, 3, 4]).issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value length is not "10"!';
    const validate = length(10, error);
    expect(validate('test').issue?.message).toBe(error);
  });
});
