import { describe, expect, test } from 'vitest';
import { notValue } from './notValue.ts';

describe('notValue', () => {
  test('should pass only valid values', () => {
    const validate1 = notValue(3);

    const value1 = 4;
    expect(validate1(value1).output).toBe(value1);
    const value2 = 2;
    expect(validate1(value2).output).toBe(value2);

    const validate2 = notValue('test');
    const value3 = 'tes';
    expect(validate2(value3).output).toBe(value3);
    const value4 = 'testx';
    expect(validate2(value4).output).toBe(value4);

    expect(validate1(3).issues).toBeTruthy();
    expect(validate2('test').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is "10"!';
    const validate = notValue(10, error);
    expect(validate(10).issues?.[0].message).toBe(error);
  });
});
