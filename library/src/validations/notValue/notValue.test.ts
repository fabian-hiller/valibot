import { describe, expect, test } from 'vitest';
import { notValue } from './notValue.ts';

describe('notValue', () => {
  test('should pass a string value that doesn’t match', () => {
    const validate = notValue('foo');

    const result = validate('bar');

    expect(result.output).toBe('bar');
    expect(result.issues).toBeUndefined();
  });

  test('should pass a number value that doesn’t match', () => {
    const validate = notValue(42);

    const result = validate(21);

    expect(result.output).toBe(21);
    expect(result.issues).toBeUndefined();
  });

  test('should pass a bigint value that doesn’t match', () => {
    const validate = notValue(42n);

    const result = validate(21n);

    expect(result.output).toBe(21n);
    expect(result.issues).toBeUndefined();
  });

  test('should pass a boolean value that doesn’t match', () => {
    const validate = notValue(true);

    const result = validate(false);

    expect(result.output).toBe(false);
    expect(result.issues).toBeUndefined();
  });

  test('should not pass when value matches', () => {
    const validate = notValue('foo');

    const result = validate('foo');

    expect(result.output).toBeUndefined();
    expect(result.issues).toEqual([
      {
        input: 'foo',
        message: 'Invalid value',
        validation: 'not_value',
      },
    ]);
  });

  test('should return a custom error message when it doesn‘t pass', () => {
    const error = 'the custom message';
    const validate = notValue('foo', error);

    const result = validate('foo');

    expect(result.issues?.[0].message).toBe(error);
  });
});
