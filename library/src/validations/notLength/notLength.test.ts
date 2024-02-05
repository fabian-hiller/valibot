import { describe, expect, test } from 'vitest';
import { notLength } from './notLength.ts';

describe('notLength', () => {
  test('should pass only valid lengths', () => {
    const validate = notLength(3);

    const value1 = '12';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '1234';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = [1, 2];
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = [1, 2, 3, 4];
    expect(validate._parse(value4).output).toBe(value4);

    expect(validate._parse('123').issues).toBeTruthy();
    expect(validate._parse([1, 2, 3]).issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value length is "5"!';
    const validate = notLength(5, error);
    expect(validate._parse('12345').issues?.[0].context.message).toBe(error);
  });
});
