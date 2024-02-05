import { describe, expect, test } from 'vitest';
import { includes } from './includes.ts';

describe('includes', () => {
  test('should pass only included values', () => {
    const validate = includes('abc');
    const value1 = 'abc';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '123abc';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = '123abc123';
    expect(validate._parse(value3).output).toBe(value3);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('Abc').issues).toBeTruthy();
    expect(validate._parse('123').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value does not include "abc"!';
    const validate = includes('abc', error);
    expect(validate._parse('test').issues?.[0].context.message).toBe(error);
  });
});
