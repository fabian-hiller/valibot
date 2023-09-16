import { describe, expect, test } from 'vitest';
import { endsWith } from './endsWith.ts';

describe('endsWith', () => {
  test('should pass only valid strings', () => {
    const validate = endsWith('abc');
    const value1 = 'abc';
    expect(validate(value1).output).toBe(value1);
    const value2 = '123abc';
    expect(validate(value2).output).toBe(value2);

    expect(validate(' ').issues).toBeTruthy();
    expect(validate('abc ').issues).toBeTruthy();
    expect(validate('abcd').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value does not end with "abc"!';
    const validate = endsWith('abc', error);
    expect(validate('test').issues?.[0].message).toBe(error);
  });
});
