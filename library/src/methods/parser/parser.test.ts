import { describe, expect, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { number, object, string } from '../../schemas/index.ts';
import type { Config, InferIssue } from '../../types/index.ts';
import { pipe } from '../pipe/index.ts';
import { parser } from './parser.ts';

describe('parser', () => {
  const entries = {
    key: pipe(
      string(),
      transform((input) => input.length)
    ),
  };

  describe('should return function object', () => {
    const schema = object(entries);

    test('without config', () => {
      const func1 = parser(schema);
      expect(func1).toBeInstanceOf(Function);
      expect(func1.schema).toBe(schema);
      expect(func1.config).toBeUndefined();
      const func2 = parser(schema, undefined);
      expect(func2).toBeInstanceOf(Function);
      expect(func2.schema).toBe(schema);
      expect(func2.config).toBeUndefined();
    });

    test('with config', () => {
      const config: Config<InferIssue<typeof schema>> = {
        abortEarly: true,
      };
      const func = parser(schema, config);
      expect(func).toBeInstanceOf(Function);
      expect(func.schema).toBe(schema);
      expect(func.config).toBe(config);
    });
  });

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
