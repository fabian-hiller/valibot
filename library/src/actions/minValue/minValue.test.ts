import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { minValue, type MinValueAction } from './minValue.ts';

describe('minValue', () => {
  describe('should return action object', () => {
    const baseAction: Omit<MinValueAction<number, 5, never>, 'message'> = {
      kind: 'validation',
      type: 'min_value',
      expects: '>=5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: MinValueAction<number, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(minValue(5)).toStrictEqual(action);
      expect(minValue(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(minValue(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies MinValueAction<number, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(minValue(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MinValueAction<number, 5, typeof message>);
    });
  });

  describe('should return no issue', () => {
    test('for untyped inputs', () => {
      expect(minValue(1)._run({ typed: false, value: null }, {})).toStrictEqual(
        { typed: false, value: null }
      );
    });

    test('for valid bigints', () => {
      expectNoActionIssue(minValue(10n), [10n, 11n, 9999n]);
    });

    test('for valid booleans', () => {
      expectNoActionIssue(minValue(false), [false, true]);
      expectNoActionIssue(minValue(true), [true]);
    });

    test('for valid dates', () => {
      const date = new Date();
      expectNoActionIssue(minValue(date), [
        date,
        new Date(+date + 1),
        new Date(+date + 999999),
      ]);
    });

    test('for valid numbers', () => {
      expectNoActionIssue(minValue(10), [10, 11, 9999, Number.MAX_VALUE]);
    });

    test('for valid strings', () => {
      expectNoActionIssue(minValue('2024'), ['2024', '2025', '9999', 'XYZ']);
    });
  });

  describe('should return an issue', () => {
    const baseInfo = {
      kind: 'validation',
      type: 'min_value',
      message: 'message',
    } as const;

    test('for invalid bigints', () => {
      expectActionIssue(
        minValue(10n, 'message'),
        { ...baseInfo, expected: '>=10', requirement: 10n },
        [-9999n, 0n, 9n]
      );
    });

    test('for invalid booleans', () => {
      expectActionIssue(
        minValue(true, 'message'),
        { ...baseInfo, expected: '>=true', requirement: true },
        [false]
      );
    });

    test('for invalid dates', () => {
      const date = new Date();
      expectActionIssue(
        minValue<Date, Date, 'message'>(date, 'message'),
        { ...baseInfo, expected: `>=${date.toJSON()}`, requirement: date },
        [new Date(0), new Date(+date - 999999), new Date(+date - 1)],
        (value) => value.toJSON()
      );
    });

    test('for invalid numbers', () => {
      expectActionIssue(
        minValue(10, 'message'),
        { ...baseInfo, expected: '>=10', requirement: 10 },
        [Number.MIN_VALUE, 0, 9]
      );
    });

    test('for invalid strings', () => {
      expectActionIssue(
        minValue('2024', 'message'),
        { ...baseInfo, expected: '>="2024"', requirement: '2024' },
        ['', '1234', '2023']
      );
    });
  });
});
