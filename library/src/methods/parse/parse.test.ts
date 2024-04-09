import { describe, expect, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { number, object, string } from '../../schemas/index.ts';
import { pipe } from '../pipe/index.ts';
import { parse } from './parse.ts';

describe('parse', () => {
  const entries = {
    key: pipe(
      string(),
      transform((input) => input.length)
    ),
  };

  test('should return output for valid input', () => {
    expect(parse(string(), 'hello')).toBe('hello');
    expect(parse(number(), 123)).toBe(123);
    expect(parse(object(entries), { key: 'foo' })).toStrictEqual({
      key: 3,
    });
  });

  test('should throw error for invalid input', () => {
    expect(() => parse(string(), 123)).toThrowError();
    expect(() => parse(number(), 'foo')).toThrowError();
    expect(() => parse(object(entries), null)).toThrowError();
  });
});
