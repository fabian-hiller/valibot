import { describe, expect, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { number, object, string } from '../../schemas/index.ts';
import { pipe } from '../pipe/index.ts';
import { parser } from './parser.ts';

describe('parser', () => {
  const entries = {
    key: pipe(
      string(),
      transform((input) => input.length)
    ),
  };

  test('should return output for valid input', () => {
    expect(parser(string())('hello')).toBe('hello');
    expect(parser(number())(123)).toBe(123);
    expect(parser(object(entries))({ key: 'foo' })).toStrictEqual({
      key: 3,
    });
  });

  test('should throw error for invalid input', () => {
    expect(() => parser(string())(123)).toThrowError();
    expect(() => parser(number())('foo')).toThrowError();
    expect(() => parser(object(entries))(null)).toThrowError();
  });
});
