import { describe, expect, test } from 'vitest';
import { maxLength } from './maxLength.ts';

describe('maxLength', () => {
  test('should pass only valid lengths', () => {
    const validate = maxLength(3);

    const value1 = '';
    expect(validate(value1).output).toBe(value1);
    const value2 = '12';
    expect(validate(value2).output).toBe(value2);
    const value3 = [1, 2, 3];
    expect(validate(value3).output).toBe(value3);

    expect(validate('1234').issue).toBeTruthy();
    expect(validate('123456789').issue).toBeTruthy();
    expect(validate([1, 2, 3, 4]).issue).toBeTruthy();
    expect(validate([1, 2, 3, 4, 5, 6, 7]).issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value length is greater than "3"!';
    const validate = maxLength(3, error);
    expect(validate('test').issue?.message).toBe(error);
  });
});
