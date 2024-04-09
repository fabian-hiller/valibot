import { describe, expect, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { number, object, string } from '../../schemas/index.ts';
import { pipe } from '../pipe/index.ts';
import { is } from './is.ts';

describe('is', () => {
  const entries = {
    key: pipe(
      string(),
      transform((input) => input.length)
    ),
  };

  test('should return true for valid input', () => {
    expect(is(string(), 'foo')).toBe(true);
    expect(is(number(), 123)).toBe(true);
    expect(is(object(entries), { key: 'foo' })).toBe(true);
  });

  test('should return false for invalid input', () => {
    expect(is(string(), 123)).toBe(false);
    expect(is(number(), 'foo')).toBe(false);
    expect(is(object(entries), null)).toBe(false);
  });
});
