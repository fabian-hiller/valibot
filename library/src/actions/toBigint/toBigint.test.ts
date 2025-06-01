import { describe, expect, test } from 'vitest';
import {
  toBigint,
  type ToBigintAction,
  type ToBigintIssue,
} from './toBigint.ts';

describe('toBigint', () => {
  test('should return action object', () => {
    expect(toBigint()).toStrictEqual({
      kind: 'transformation',
      type: 'to_bigint',
      reference: toBigint,
      async: false,
      '~run': expect.any(Function),
    } satisfies ToBigintAction<bigint>);
  });

  describe('should transform to bigint', () => {
    const action = toBigint();

    test('for string', () => {
      expect(action['~run']({ typed: true, value: '123' }, {})).toStrictEqual({
        typed: true,
        value: 123n,
      });
    });

    test('for number', () => {
      expect(action['~run']({ typed: true, value: 123 }, {})).toStrictEqual({
        typed: true,
        value: 123n,
      });
    });

    test('for bigint', () => {
      expect(action['~run']({ typed: true, value: 123n }, {})).toStrictEqual({
        typed: true,
        value: 123n,
      });
    });

    test('for boolean', () => {
      expect(action['~run']({ typed: true, value: true }, {})).toStrictEqual({
        typed: true,
        value: 1n,
      });
    });
  });
  describe('should return dataset with issues', () => {
    const action = toBigint();
    const baseIssue: Omit<
      ToBigintIssue<number>,
      'input' | 'received' | 'message'
    > = {
      kind: 'transformation',
      type: 'to_bigint',
      expected: null,
    };

    test('for invalid inputs', () => {
      const value = Symbol();
      // @ts-expect-error
      expect(action['~run']({ typed: true, value }, {})).toStrictEqual({
        typed: false,
        value,
        issues: [
          {
            ...baseIssue,
            input: value,
            received: 'symbol',
            message: 'Invalid bigint: Received symbol',
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
