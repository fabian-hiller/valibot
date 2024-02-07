import { describe, expect, test } from 'vitest';
import { startsWith } from './startsWith.ts';

describe('startsWith', () => {
  test('should pass only valid strings', () => {
    const validate = startsWith('abc');
    const value1 = 'abc';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = 'abc123';
    expect(validate._parse(value2).output).toBe(value2);

    expect(validate._parse(' ').issues).toBeTruthy();
    expect(validate._parse(' abc').issues).toBeTruthy();
    expect(validate._parse('1abc').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value does not start with "abc"!';
    const validate = startsWith('abc', error);
    expect(validate._parse('test').issues?.[0].context.message).toBe(error);
  });
});
