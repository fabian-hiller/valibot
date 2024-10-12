import { describe, expect, test } from 'vitest';
import type { NumberIssue } from '../../schemas/index.ts';
import { _stringify } from '../../utils/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { maxValue, type MaxValueAction } from './maxValue.ts';

describe('maxValue', () => {
  describe('should return action object', () => {
    const baseAction: Omit<MaxValueAction<number, 5, never>, 'message'> = {
      kind: 'validation',
      type: 'max_value',
      reference: maxValue,
      expects: '<=5',
      requirement: 5,
      async: false,
      '~validate': expect.any(Function),
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
      const issues: [NumberIssue] = [
        {
          kind: 'schema',
          type: 'number',
          input: null,
          expected: 'number',
          received: 'null',
          message: 'message',
        },
      ];
      expect(
        maxValue(1)['~validate']({ typed: false, value: null, issues }, {})
      ).toStrictEqual({ typed: false, value: null, issues });
    });

    test('for valid bigints', () => {
      expectNoActionIssue(maxValue(10n), [-9999n, 0n, 10n]);
    });

    test('for valid non-bigints', () => {
      expectNoActionIssue(maxValue(10n), [
        '-12',
        '-10',
        '',
        ' ',
        '0',
        '10',
        ' 10 ',
        -10,
        0,
        10,
        -Infinity,
        -10.0,
        0.0,
        10.0,
        false,
        true,
        new Date(-10),
        new Date(0),
        new Date(10),
      ]);

      expectNoActionIssue(maxValue(1n), [
        '-2',
        '-1',
        '',
        ' ',
        '0',
        ' 0 ',
        '1',
        -Infinity,
        -2,
        -1,
        0,
        0.0,
        1,
        false,
        true,
        new Date(-2),
        new Date(-1),
        new Date(0),
        new Date(1),
      ]);

      expectNoActionIssue(maxValue(0n), [
        '-1',
        ' -1 ',
        ' ',
        '0',
        -Infinity,
        -1,
        -1.0,
        -0.5,
        -0,
        false,
        new Date(-1),
        new Date(0),
      ]);
    });

    test('for valid booleans', () => {
      expectNoActionIssue(maxValue(true), [true, false]);
      expectNoActionIssue(maxValue(false), [false]);
    });

    test('for valid non-booleans', () => {
      expectNoActionIssue(maxValue(true), [
        '-2',
        '-2.0',
        '-1',
        '-1.0',
        '',
        ' ',
        '0',
        '0.0',
        ' 0 ',
        '1',
        '1.0',
        -Infinity,
        -2,
        -1,
        0,
        0.0,
        1,
        new Date(-2),
        new Date(-1),
        new Date(0),
        new Date(1),
        -2n,
        -1n,
        0n,
        1n,
      ]);

      expectNoActionIssue(maxValue(false), [
        '-1',
        '-1.0',
        ' -1 ',
        ' ',
        '0',
        '0.0',
        -Infinity,
        -1,
        -1.0,
        -0.5,
        -0,
        new Date(-1),
        new Date(0),
        -1n,
        0n,
      ]);
    });

    test('for valid dates', () => {
      const date = new Date();
      expectNoActionIssue(maxValue(date), [
        new Date(0),
        new Date(+date - 999999),
        date,
      ]);
    });

    test('for valid non-dates', () => {
      const date1 = new Date(10);
      expectNoActionIssue(maxValue(date1), [
        '-12',
        '-10',
        '-10.0',
        '',
        ' ',
        '0',
        '0.0',
        '10',
        '10.0',
        ' 10 ',
        -10,
        0,
        10,
        -Infinity,
        -10.0,
        0.0,
        10.0,
        false,
        true,
        -10n,
        0n,
        10n,
      ]);

      const date2 = new Date(1);
      expectNoActionIssue(maxValue(date2), [
        '-2',
        '-2.0',
        '-1',
        '-1.0',
        '',
        ' ',
        '0',
        '0.0',
        ' 0 ',
        '1',
        '1.0',
        -Infinity,
        -2,
        -1,
        0,
        0.0,
        1,
        false,
        true,
        -2n,
        -1n,
        0n,
        1n,
      ]);

      const date3 = new Date(0);
      expectNoActionIssue(maxValue(date3), [
        '-1',
        '-1.0',
        ' -1 ',
        ' ',
        '0',
        '0.0',
        -Infinity,
        -1,
        -1.0,
        -0.5,
        -0,
        false,
        -1n,
        0n,
      ]);
    });

    test('for valid numbers', () => {
      expectNoActionIssue(maxValue(10), [Number.MIN_VALUE, 0, 10]);
    });

    test('for valid non-numbers', () => {
      expectNoActionIssue(maxValue(10), [
        '-12',
        '-10',
        '-10.0',
        '',
        ' ',
        '0',
        '0.0',
        '10',
        '10.0',
        ' 10 ',
        false,
        true,
        new Date(-10),
        new Date(0),
        new Date(10),
        -10n,
        0n,
        10n,
      ]);

      expectNoActionIssue(maxValue(1), [
        '-2',
        '-2.0',
        '-1',
        '-1.0',
        '',
        ' ',
        '0',
        '0.0',
        ' 0 ',
        '1',
        '1.0',
        false,
        true,
        new Date(-2),
        new Date(-1),
        new Date(0),
        new Date(1),
        -2n,
        -1n,
        0n,
        1n,
      ]);

      expectNoActionIssue(maxValue(0), [
        '-1',
        '-1.0',
        ' -1 ',
        ' ',
        '0',
        '0.0',
        false,
        new Date(-1),
        new Date(0),
        -1n,
        0n,
      ]);
    });

    test('for valid strings', () => {
      expectNoActionIssue(maxValue('2024'), ['', '1234', '2024']);
    });

    test('for valid non-strings', () => {
      expectNoActionIssue(maxValue('10'), [
        -10,
        0,
        10,
        -Infinity,
        -10.0,
        0.0,
        10.0,
        false,
        true,
        new Date(-10),
        new Date(0),
        new Date(10),
        -10n,
        0n,
        10n,
      ]);

      expectNoActionIssue(maxValue('1'), [
        -Infinity,
        -2,
        -1,
        0,
        0.0,
        1,
        false,
        true,
        new Date(-2),
        new Date(-1),
        new Date(0),
        new Date(1),
        -2n,
        -1n,
        0n,
        1n,
      ]);

      expectNoActionIssue(maxValue('0'), [
        -Infinity,
        -1,
        -1.0,
        -0.5,
        -0,
        false,
        new Date(-1),
        new Date(0),
        -1n,
        0n,
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const baseInfo = {
      kind: 'validation',
      type: 'max_value',
      message: 'message',
    } as const;

    const getReceived = (value: unknown): string =>
      value instanceof Date ? value.toJSON() : _stringify(value);

    test('for invalid bigints', () => {
      expectActionIssue(
        maxValue(10n, 'message'),
        { ...baseInfo, expected: '<=10', requirement: 10n },
        [11n, 9999n]
      );
    });

    test('for invalid non-bigints', () => {
      expectActionIssue(
        maxValue(123n, 'message'),
        { ...baseInfo, expected: '<=123', requirement: 123n },
        [
          'nan',
          '123px',
          '+ 123',
          '123.0',
          '126',
          124,
          124.0,
          Infinity,
          NaN,
          new Date(124),
        ],
        getReceived
      );

      expectActionIssue(
        maxValue(1n, 'message'),
        { ...baseInfo, expected: '<=1', requirement: 1n },
        ['nan', '1px', '+ 1', '1.0', '2', 2, 2.0, Infinity, NaN, new Date(2)],
        getReceived
      );

      expectActionIssue(
        maxValue(0n, 'message'),
        { ...baseInfo, expected: '<=0', requirement: 0n },
        [
          'nan',
          '0px',
          '+ 0',
          '0.0',
          '1',
          0.5,
          1,
          1.0,
          Infinity,
          NaN,
          true,
          new Date(1),
        ],
        getReceived
      );
    });

    test('for invalid booleans', () => {
      expectActionIssue(
        maxValue(false, 'message'),
        { ...baseInfo, expected: '<=false', requirement: false },
        [true]
      );
    });

    test('for invalid non-booleans', () => {
      expectActionIssue(
        maxValue(false, 'message'),
        { ...baseInfo, expected: '<=false', requirement: false },
        ['nan', '0px', '+ 0', '1', 0.5, 1, 1.0, Infinity, NaN, new Date(1), 1n],
        getReceived
      );

      expectActionIssue(
        maxValue(true, 'message'),
        { ...baseInfo, expected: '<=true', requirement: true },
        ['nan', '1px', '+ 1', '2', 2, 2.0, Infinity, NaN, new Date(2), 2n],
        getReceived
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

    test('for invalid non-dates', () => {
      const date1 = new Date(123);
      expectActionIssue(
        maxValue(date1, 'message'),
        { ...baseInfo, expected: `<=${date1.toJSON()}`, requirement: date1 },
        [
          'nan',
          '123px',
          '+ 123',
          '123.5',
          '126',
          124,
          124.0,
          Infinity,
          NaN,
          124n,
        ],
        getReceived
      );

      const date2 = new Date(1);
      expectActionIssue(
        maxValue(date2, 'message'),
        { ...baseInfo, expected: `<=${date2.toJSON()}`, requirement: date2 },
        ['nan', '1px', '+ 1', '2', 2, 2.0, Infinity, NaN, 2n],
        getReceived
      );

      const date3 = new Date(0);
      expectActionIssue(
        maxValue(date3, 'message'),
        { ...baseInfo, expected: `<=${date3.toJSON()}`, requirement: date3 },
        ['nan', '0px', '+ 0', '1', 0.5, 1, 1.0, Infinity, NaN, true, 1n],
        getReceived
      );
    });

    test('for invalid numbers', () => {
      expectActionIssue(
        maxValue(10, 'message'),
        { ...baseInfo, expected: '<=10', requirement: 10 },
        [11, 9999, Number.MAX_VALUE]
      );
    });

    test('for invalid non-numbers', () => {
      expectActionIssue(
        maxValue(123, 'message'),
        { ...baseInfo, expected: '<=123', requirement: 123 },
        ['nan', '123px', '+ 123', '126', new Date(124), 124n],
        getReceived
      );

      expectActionIssue(
        maxValue(1, 'message'),
        { ...baseInfo, expected: '<=1', requirement: 1 },
        ['nan', '1px', '+ 1', '2', new Date(2), 2n],
        getReceived
      );

      expectActionIssue(
        maxValue(0, 'message'),
        { ...baseInfo, expected: '<=0', requirement: 0 },
        ['nan', '0px', '+ 0', '0.5', '1', true, new Date(1), 1n],
        getReceived
      );
    });

    test('for invalid strings', () => {
      expectActionIssue(
        maxValue('2024', 'message'),
        { ...baseInfo, expected: '<="2024"', requirement: '2024' },
        ['2025', '9999', 'XYZ']
      );
    });

    test('for invalid non-strings', () => {
      expectActionIssue(
        maxValue('123', 'message'),
        { ...baseInfo, expected: '<="123"', requirement: '123' },
        [123.5, 124, 124.0, Infinity, NaN, new Date(124), 124n],
        getReceived
      );

      expectActionIssue(
        maxValue('1', 'message'),
        { ...baseInfo, expected: '<="1"', requirement: '1' },
        [2, 2.0, Infinity, NaN, new Date(2), 2n],
        getReceived
      );

      expectActionIssue(
        maxValue('0', 'message'),
        { ...baseInfo, expected: '<="0"', requirement: '0' },
        [0.5, 1, 1.0, Infinity, NaN, true, new Date(1), 1n],
        getReceived
      );
    });
  });
});
