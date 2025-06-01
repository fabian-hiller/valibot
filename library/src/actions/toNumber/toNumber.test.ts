import { describe, expect, test } from 'vitest';
import {
  toNumber,
  type ToNumberAction,
  type ToNumberIssue,
} from './toNumber.ts';

describe('toNumber', () => {
  test('should return action object', () => {
    expect(toNumber()).toStrictEqual({
      kind: 'transformation',
      type: 'to_number',
      reference: toNumber,
      async: false,
      '~run': expect.any(Function),
    } satisfies ToNumberAction<unknown>);
  });

  describe('should transform to number', () => {
    const action = toNumber();

    test('for string', () => {
      expect(action['~run']({ typed: true, value: '123' }, {})).toStrictEqual({
        typed: true,
        value: 123,
      });
    });

    test('for number', () => {
      expect(action['~run']({ typed: true, value: 123 }, {})).toStrictEqual({
        typed: true,
        value: 123,
      });
    });

    test('for bigint', () => {
      expect(action['~run']({ typed: true, value: 123n }, {})).toStrictEqual({
        typed: true,
        value: 123,
      });
    });

    test('for boolean', () => {
      expect(action['~run']({ typed: true, value: true }, {})).toStrictEqual({
        typed: true,
        value: 1,
      });
    });

    test('for null', () => {
      expect(action['~run']({ typed: true, value: null }, {})).toStrictEqual({
        typed: true,
        value: 0,
      });
    });

    test('for undefined', () => {
      expect(
        action['~run']({ typed: true, value: undefined }, {})
      ).toStrictEqual({
        typed: true,
        value: Number.NaN,
      });
    });
  });
  describe('should return dataset with issues', () => {
    const action = toNumber();
    const baseIssue: Omit<
      ToNumberIssue<number>,
      'input' | 'received' | 'message'
    > = {
      kind: 'transformation',
      type: 'to_number',
      expected: null,
    };

    test('for invalid inputs', () => {
      const value = Symbol();
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [
          {
            ...baseIssue,
            input: value,
            received: 'symbol',
            message: 'Invalid number: Received symbol',
            requirement: undefined,
            path: undefined,
            issues: undefined,
            lang: undefined,
            abortEarly: undefined,
            abortPipeEarly: undefined,
          },
        ],
      });
    });
  });
});
