import { describe, expect, test } from 'vitest';
import { pipe } from '../../methods/index.ts';
import { number, object, string } from '../../schemas/index.ts';
import { transform } from '../index.ts';
import { withParse, type WithParseMetadata } from './withParse.ts';

describe('withParse', () => {
  test('should return metadata object', () => {
    const metadata: WithParseMetadata<unknown> = {
      kind: 'metadata',
      type: 'with_parse',
      reference: withParse,
      extraProperties: {
        parse: expect.any(Function),
      },
    };

    expect(withParse()).toStrictEqual(metadata);
  });

  describe('should work in pipe', () => {
    const entries = {
      key: pipe(
        string(),
        transform((input) => input.length)
      ),
    };

    test('should return output for valid input', () => {
      expect(pipe(string(), withParse()).parse('hello')).toBe('hello');
      expect(pipe(number(), withParse()).parse(123)).toBe(123);
      expect(
        pipe(object(entries), withParse()).parse({ key: 'foo' })
      ).toStrictEqual({
        key: 3,
      });
    });

    test('should throw error for invalid input', () => {
      expect(() => pipe(string(), withParse()).parse(123)).toThrowError();
      expect(() => pipe(number(), withParse()).parse('foo')).toThrowError();
      expect(() =>
        pipe(object(entries), withParse()).parse(null)
      ).toThrowError();
    });
  });
});
