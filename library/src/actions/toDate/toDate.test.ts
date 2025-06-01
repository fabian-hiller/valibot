import { describe, expect, test } from 'vitest';
import { toDate, type ToDateAction, type ToDateIssue } from './toDate.ts';

describe('toDate', () => {
  test('should return action object', () => {
    expect(toDate()).toStrictEqual({
      kind: 'transformation',
      type: 'to_date',
      reference: toDate,
      async: false,
      '~run': expect.any(Function),
    } satisfies ToDateAction<string>);
  });

  describe('should transform to date', () => {
    const action = toDate();

    test('for string', () => {
      expect(
        action['~run']({ typed: true, value: '2024-05-06' }, {})
      ).toStrictEqual({
        typed: true,
        value: expect.any(Date),
      });
    });

    test('for number', () => {
      expect(
        action['~run']({ typed: true, value: 1714924800000 }, {})
      ).toStrictEqual({
        typed: true,
        value: expect.any(Date),
      });
    });

    test('for date', () => {
      const date = new Date();
      expect(action['~run']({ typed: true, value: date }, {})).toStrictEqual({
        typed: true,
        value: date,
      });
    });
  });
  describe('should return dataset with issues', () => {
    const action = toDate();
    const baseIssue: Omit<
      ToDateIssue<number>,
      'input' | 'received' | 'message'
    > = {
      kind: 'transformation',
      type: 'to_date',
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
            message: 'Invalid date: Received symbol',
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
