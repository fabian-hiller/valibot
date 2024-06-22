import { describe, expect, test } from 'vitest';
import { pipe, pipeAsync } from '../../methods/index.ts';
import { number, object, string } from '../../schemas/index.ts';
import { transform } from '../index.ts';
import { asParser, type AsParserMetadata } from './asParser.ts';

describe('asParser', () => {
  test('should return metadata object', () => {
    const metadata: AsParserMetadata<unknown> = {
      kind: 'metadata',
      type: 'as_parser',
      reference: asParser,
      extraProperties: {
        parse: expect.any(Function),
      },
    };

    expect(asParser()).toStrictEqual(metadata);
  });

  describe('should work in pipe', () => {
    const entries = {
      key: pipe(
        string(),
        transform((input) => input.length)
      ),
    };

    test('should return output for valid input', () => {
      expect(pipe(string(), asParser()).parse('hello')).toBe('hello');
      expect(pipe(number(), asParser()).parse(123)).toBe(123);
      expect(
        pipe(object(entries), asParser()).parse({ key: 'foo' })
      ).toStrictEqual({
        key: 3,
      });
      expect(pipeAsync(string(), asParser()).parse('hello')).toEqual(
        expect.any(Promise)
      );
      expect(pipeAsync(string(), asParser()).parse('hello')).resolves.toBe(
        'hello'
      );
    });

    test('should throw error for invalid input', () => {
      expect(() => pipe(string(), asParser()).parse(123)).toThrowError();
      expect(() => pipe(number(), asParser()).parse('foo')).toThrowError();
      expect(() =>
        pipe(object(entries), asParser()).parse(null)
      ).toThrowError();

      expect(pipeAsync(string(), asParser()).parse(123)).rejects.toThrowError();
    });
  });
});
