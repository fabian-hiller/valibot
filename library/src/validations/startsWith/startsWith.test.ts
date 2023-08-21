import { describe, expect, test } from 'vitest';
import { startsWith } from './startsWith.ts';

describe('startsWith', () => {
  test('should pass only valid strings', () => {
    const validate = startsWith('abc');
    const value1 = 'abc';
    expect(validate(value1).output).toBe(value1);
    const value2 = 'abc123';
    expect(validate(value2).output).toBe(value2);

    expect(validate(' ').issue).toBeTruthy();
    expect(validate(' abc').issue).toBeTruthy();
    expect(validate('1abc').issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value does not start with "abc"!';
    const validate = startsWith('abc', error);
    expect(validate('test').issue?.message).toBe(error);
  });
});
