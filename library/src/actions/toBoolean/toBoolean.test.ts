import { describe, expect, test } from 'vitest';
import { toBoolean, type ToBooleanAction } from './toBoolean.ts';

describe('toBoolean', () => {
  test('should return action object', () => {
    expect(toBoolean()).toStrictEqual({
      kind: 'transformation',
      type: 'to_boolean',
      reference: toBoolean,
      async: false,
      '~run': expect.any(Function),
    } satisfies ToBooleanAction<unknown>);
  });

  describe('should transform to boolean', () => {
    const action = toBoolean();

    test('for string', () => {
      expect(action['~run']({ typed: true, value: 'foo' }, {})).toStrictEqual({
        typed: true,
        value: true,
      });
    });

    test('for number', () => {
      expect(action['~run']({ typed: true, value: 1 }, {})).toStrictEqual({
        typed: true,
        value: true,
      });
    });

    test('for bigint', () => {
      expect(action['~run']({ typed: true, value: 1n }, {})).toStrictEqual({
        typed: true,
        value: true,
      });
    });

    test('for boolean', () => {
      expect(action['~run']({ typed: true, value: true }, {})).toStrictEqual({
        typed: true,
        value: true,
      });
    });

    test('for null', () => {
      expect(action['~run']({ typed: true, value: null }, {})).toStrictEqual({
        typed: true,
        value: false,
      });
    });

    test('for undefined', () => {
      expect(
        action['~run']({ typed: true, value: undefined }, {})
      ).toStrictEqual({
        typed: true,
        value: false,
      });
    });

    test('for symbol', () => {
      expect(
        action['~run']({ typed: true, value: Symbol('foo') }, {})
      ).toStrictEqual({
        typed: true,
        value: true,
      });
    });
  });
});
