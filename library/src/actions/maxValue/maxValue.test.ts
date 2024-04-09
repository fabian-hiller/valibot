import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { maxValue, type MaxValueAction } from './maxValue.ts';

describe('maxValue', () => {
  describe('should return action object', () => {
    const baseAction: Omit<MaxValueAction<number, 5, never>, 'message'> = {
      kind: 'validation',
      type: 'max_value',
      expects: '<=5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: MaxValueAction<number, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(maxValue(5)).toStrictEqual(action);
      expect(maxValue(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(maxValue(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies MaxValueAction<number, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(maxValue(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MaxValueAction<number, 5, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for untyped inputs', () => {
      expect(maxValue(1)._run({ typed: false, value: null }, {})).toStrictEqual(
        { typed: false, value: null }
      );
    });

    test('for valid bigints', () => {
      expectNoActionIssue(maxValue(10n), [-9999n, 0n, 10n]);
    });

    test('for valid booleans', () => {
      expectNoActionIssue(maxValue(true), [true, false]);
      expectNoActionIssue(maxValue(false), [false]);
    });

    test('for valid dates', () => {
      const date = new Date();
      expectNoActionIssue(maxValue(date), [
        new Date(0),
        new Date(+date - 999999),
        date,
      ]);
    });

    test('for valid numbers', () => {
      expectNoActionIssue(maxValue(10), [Number.MIN_VALUE, 0, 10]);
    });

    test('for valid strings', () => {
      expectNoActionIssue(maxValue('2024'), ['', '1234', '2024']);
    });
  });

  describe('should return dataset with issues', () => {
    const baseInfo = {
      kind: 'validation',
      type: 'max_value',
      message: 'message',
    } as const;

    test('for invalid bigints', () => {
      expectActionIssue(
        maxValue(10n, 'message'),
        { ...baseInfo, expected: '<=10', requirement: 10n },
        [11n, 9999n]
      );
    });

    test('for invalid booleans', () => {
      expectActionIssue(
        maxValue(false, 'message'),
        { ...baseInfo, expected: '<=false', requirement: false },
        [true]
      );
    });

    test('for invalid dates', () => {
      const date = new Date();
      expectActionIssue(
        maxValue<Date, Date, 'message'>(date, 'message'),
        { ...baseInfo, expected: `<=${date.toJSON()}`, requirement: date },
        [new Date(+date + 1), new Date(+date + 999999)],
        (value) => value.toJSON()
      );
    });

    test('for invalid numbers', () => {
      expectActionIssue(
        maxValue(10, 'message'),
        { ...baseInfo, expected: '<=10', requirement: 10 },
        [11, 9999, Number.MAX_VALUE]
      );
    });

    test('for invalid strings', () => {
      expectActionIssue(
        maxValue('2024', 'message'),
        { ...baseInfo, expected: '<="2024"', requirement: '2024' },
        ['2025', '9999', 'XYZ']
      );
    });
  });
});
