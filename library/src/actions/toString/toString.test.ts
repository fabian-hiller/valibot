import { describe, expect, test } from 'vitest';
import { toString, type ToStringAction } from './toString.ts';

describe('toString', () => {
  test('should return action object', () => {
    expect(toString()).toStrictEqual({
      kind: 'transformation',
      type: 'to_string',
      reference: toString,
      async: false,
      '~run': expect.any(Function),
    } satisfies ToStringAction<unknown>);
  });

  describe('should transform to string', () => {
    const action = toString();

    test('for string', () => {
      expect(action['~run']({ typed: true, value: 'foo' }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });

    test('for number', () => {
      expect(action['~run']({ typed: true, value: 123 }, {})).toStrictEqual({
        typed: true,
        value: '123',
      });
    });

    test('for bigint', () => {
      expect(action['~run']({ typed: true, value: 123n }, {})).toStrictEqual({
        typed: true,
        value: '123',
      });
    });

    test('for boolean', () => {
      expect(action['~run']({ typed: true, value: true }, {})).toStrictEqual({
        typed: true,
        value: 'true',
      });
    });

    test('for null', () => {
      expect(action['~run']({ typed: true, value: null }, {})).toStrictEqual({
        typed: true,
        value: 'null',
      });
    });

    test('for undefined', () => {
      expect(
        action['~run']({ typed: true, value: undefined }, {})
      ).toStrictEqual({
        typed: true,
        value: 'undefined',
      });
    });

    test('for symbol', () => {
      expect(
        action['~run']({ typed: true, value: Symbol('foo') }, {})
      ).toStrictEqual({
        typed: true,
        value: 'Symbol(foo)',
      });
    });
  });
});
