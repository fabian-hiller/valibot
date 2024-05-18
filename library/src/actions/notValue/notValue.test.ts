import { describe, expect, test } from 'vitest';
import { _stringify } from '../../utils/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { notValue, type NotValueAction } from './notValue.ts';

describe('notValue', () => {
  describe('should return action object', () => {
    const baseAction: Omit<NotValueAction<number, 5, never>, 'message'> = {
      kind: 'validation',
      type: 'not_value',
      reference: notValue,
      expects: '!5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: NotValueAction<number, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(notValue(5)).toStrictEqual(action);
      expect(notValue(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(notValue(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies NotValueAction<number, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(notValue(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies NotValueAction<number, 5, typeof message>);
    });
  });

  describe('should return dataset with issues', () => {
    test('for untyped inputs', () => {
      expect(notValue(1)._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid bigints', () => {
      expectNoActionIssue(notValue(123n), [
        122n,
        BigInt(122),
        BigInt('122'),
        124n,
        BigInt(124),
        BigInt('124'),
        0n,
        BigInt(0n),
        BigInt('0'),
      ]);
    });

    test('for valid non-bigints', () => {
      expectNoActionIssue(notValue(123n), [
        122,
        122.0,
        '122',
        ' 122 ',
        new Date(122),
        124,
        124.0,
        '124',
        ' 124 ',
        new Date(124),
        0,
        0.0,
        '0',
        ' 0 ',
        new Date(0),
        '',
        ' ',
      ]);
      expectNoActionIssue(notValue(1n), [
        0,
        0.0,
        '0',
        ' 0 ',
        false,
        new Date(0),
        2,
        2.0,
        '2',
        ' 2 ',
        new Date(2),
        '',
        ' ',
      ]);
      expectNoActionIssue(notValue(0n), [
        -1,
        -1.0,
        '-1',
        ' -1 ',
        ' -1.0 ',
        true,
        new Date(1),
        2,
        2.0,
        '2',
        ' 2 ',
        new Date(2),
      ]);
    });

    test('for valid booleans', () => {
      expectNoActionIssue(notValue(true), [false]);
      expectNoActionIssue(notValue(false), [true]);
    });

    test('for valid non-booleans', () => {
      expectNoActionIssue(notValue(false), [
        1,
        1.0,
        1n,
        '1',
        '1.0',
        ' 1 ',
        new Date(1),
      ]);
      expectNoActionIssue(notValue(true), [
        0,
        0.0,
        0n,
        '0',
        '0.0',
        ' 0 ',
        '',
        ' ',
        new Date(0),
      ]);
    });

    test('for valid dates', () => {
      const date = new Date();
      const nextDate = new Date(+date + 1);
      expectNoActionIssue(notValue(date), [
        new Date(+date - 1),
        new Date(+date + 1), 
        new Date(+date + 999999),
        nextDate,
        new Date(nextDate.getTime()),
        new Date(nextDate.toISOString()),
        new Date(
          nextDate.getFullYear(),
          nextDate.getMonth(),
          nextDate.getDate(),
          nextDate.getHours(),
          nextDate.getMinutes(),
          nextDate.getSeconds(),
          nextDate.getMilliseconds()
        ),
      ]);
    });

    test('for valid non-dates', () => {
      expectNoActionIssue(notValue(new Date(123)), [
        122,
        122.0,
        '122',
        ' 122 ',
        124,
        124.0,
        '124',
        ' 124 ',
        0,
        0.0,
        '0',
        ' 0 ',
        '',
        ' ',
      ]);
      expectNoActionIssue(notValue(new Date(1)), [
        0,
        0.0,
        '0',
        ' 0 ',
        false,
        new Date(0),
        2,
        2.0,
        '2',
        ' 2 ',
        new Date(2),
      ]);
      expectNoActionIssue(notValue(new Date(0)), [
        -1,
        -1.0,
        '-1',
        ' -1 ',
        ' -1.0 ',
        true,
        new Date(1),
        2,
        2.0,
        '2',
        ' 2 ',
        new Date(2),
      ]);
    });

    test('for valid numbers', () => {
      expectNoActionIssue(notValue(123), [
        -Infinity,
        Number.MIN_VALUE,
        -10,
        -9,
        9,
        11,
        9999,
        Number.MAX_VALUE,
        Infinity,
        NaN,
        122,
        124,
      ]);
    });

    test('for valid non-numbers', () => {
      expectNoActionIssue(notValue(123), [
        122,
        122.0,
        '122',
        ' 122 ',
        new Date(122),
        124,
        124.0,
        '124',
        ' 124 ',
        new Date(124),
        0,
        0.0,
        '0',
        ' 0 ',
        new Date(0),
        '',
        ' ',
      ]);
      expectNoActionIssue(notValue(1), [
        0,
        0.0,
        '0',
        ' 0 ',
        false,
        new Date(0),
        2,
        2.0,
        '2',
        ' 2 ',
        new Date(2),
      ]);
      expectNoActionIssue(notValue(0), [
        -1,
        -1.0,
        '-1',
        ' -1 ',
        ' -1.0 ',
        true,
        new Date(1),
        2,
        2.0,
        '2',
        ' 2 ',
        new Date(2),
      ]);
    });

    test('for valid strings', () => {
      expectNoActionIssue(notValue('2024'), [
        '202',
        '024',
        ' 2024',
        '2024 ',
        '02024',
        '20240',
        '020240',
        '2025',
        '9999',
        'XYZ',
      ]);
    });

    test('for valid non-strings', () => {
      expectNoActionIssue(notValue('1'), [0n, 0, 0.0, false, new Date(0)]);
      expectNoActionIssue(notValue('0'), [1n, 1, 1.0, true, new Date(1)]);
    });
  });

  describe('should return dataset with issues', () => {
    const baseInfo = {
      kind: 'validation',
      type: 'not_value',
      message: 'message',
    } as const;

    const getReceived = (value: unknown): string =>
      value instanceof Date ? value.toJSON() : _stringify(value);

    test('for invalid bigints', () => {
      expectActionIssue(
        notValue(123n, 'message'),
        { ...baseInfo, expected: '!123', requirement: 123n },
        [123n, BigInt(123), BigInt('123')]
      );
    });

    test('for invalid non-bigints', () => {
      expectActionIssue(
        notValue(10n, 'message'),
        { ...baseInfo, expected: '!10', requirement: 10n },
        [10, 10.0, '10', new Date(10)],
        getReceived
      );
    });

    test('for invalid booleans', () => {
      expectActionIssue(
        notValue(true, 'message'),
        { ...baseInfo, expected: '!true', requirement: true },
        [true]
      );
      expectActionIssue(
        notValue(false, 'message'),
        { ...baseInfo, expected: '!false', requirement: false },
        [false]
      );
    });

    test('for invalid non-booleans', () => {
      expectActionIssue(
        notValue(false, 'message'),
        { ...baseInfo, expected: '!false', requirement: false },
        [0n, 0, 0.0, '0', '0.0', '', ' ', new Date(0)],
        getReceived
      );
      expectActionIssue(
        notValue(true, 'message'),
        { ...baseInfo, expected: '!true', requirement: true },
        [1n, 1, 1.0, '1', '1.0', new Date(1)],
        getReceived
      );
    });

    test('for invalid dates', () => {
      // TODO: we probably need a better way to test this
      const date = new Date();
      expectActionIssue(
        notValue<Date, Date, 'message'>(date, 'message'),
        { ...baseInfo, expected: `!${date.toJSON()}`, requirement: date },
        [new Date(+date)],
        (value) => value.toJSON()
      );
    });

    test('for invalid non-dates', () => {
      const date = new Date(10);
      expectActionIssue(
        notValue(date, 'message'),
        { ...baseInfo, expected: `!${date.toJSON()}`, requirement: date },
        [10n, 10, 10.0, '10', '10.0'],
        getReceived
      );
    });

    test('for invalid numbers', () => {
      expectActionIssue(
        notValue(10, 'message'),
        { ...baseInfo, expected: '!10', requirement: 10 },
        [10, 10.0],
      );
    });

    test('for invalid non-numbers', () => {
      expectActionIssue(
        notValue(10, 'message'),
        { ...baseInfo, expected: '!10', requirement: 10 },
        [ '10', '10.0', new Date(10), 10n],
        getReceived
      );
    });

    test('for invalid strings', () => {
      expectActionIssue(
        notValue('2024', 'message'),
        { ...baseInfo, expected: '!"2024"', requirement: '2024' },
        ['2024']
      );
    });

    test('for invalid non-strings', () => {
      expectActionIssue(
        notValue('10', 'message'),
        { ...baseInfo, expected: '!"10"', requirement: '10' },
        [10n, 10, new Date(10)],
        getReceived
      );
    });
  });
});
