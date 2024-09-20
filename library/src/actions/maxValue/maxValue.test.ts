import { describe, expect, test } from 'vitest';
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

    test('for valid non-bigints', () => {
      expectNoActionIssue(maxValue(123n), [
        '-124',
        '',
        '1',
        ' 123 ',
        -Infinity,
        0,
        1,
        123,
        123.0,
        false,
        true,
        new Date(-124),
        new Date(0),
        new Date(123),
      ]);

      expectNoActionIssue(maxValue(0n), [
        ' ',
        '0',
        -0.5,
        -0,
        false,
        new Date(-12),
        new Date(0),
      ]);

      expectNoActionIssue(maxValue(-21n), [
        '-23',
        ' -21 ',
        -21,
        -21.5,
        new Date(-100),
        new Date(-21),
      ]);
    });

    test('for valid booleans', () => {
      expectNoActionIssue(maxValue(true), [true, false]);
      expectNoActionIssue(maxValue(false), [false]);
    });

    test('for valid non-booleans', () => {
      expectNoActionIssue(maxValue(true), [
        '-100',
        '',
        '1',
        ' 1 ',
        '1.0',
        -Infinity,
        -0,
        0,
        0.5,
        1,
        1.0,
        -100n,
        0n,
        1n,
        new Date(-10),
        new Date(0),
        new Date(1),
      ]);

      expectNoActionIssue(maxValue(false), [
        '-1',
        ' ',
        '0',
        ' 0 ',
        '0.0',
        -Infinity,
        -0,
        0.0,
        -100n,
        0n,
        new Date(-100),
        new Date(0),
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
      const date1 = new Date(101);
      expectNoActionIssue(maxValue(date1), [
        '-101',
        ' ',
        '99',
        '101',
        ' 101 ',
        '101.0',
        -Infinity,
        -101,
        -0,
        99,
        101,
        101.0,
        date1.getTime(),
        false,
        true,
        -2n,
        0n,
        99n,
        101n,
      ]);

      const date2 = new Date(-1);
      expectNoActionIssue(maxValue(date2), [
        '-2',
        '-1.5',
        '-1',
        ' -1 ',
        '-1.',
        -Infinity,
        -1,
        -1.0,
        date2.getTime(),
        -10n,
        -1n,
      ]);

      const date3 = new Date(0);
      expectNoActionIssue(maxValue(date3), [
        '-1',
        '',
        ' ',
        '0',
        ' 0 ',
        '0.',
        -Infinity,
        -0.5,
        -0,
        0.0,
        date3.getTime(),
        false,
        -10n,
        0n,
      ]);
    });

    test('for valid numbers', () => {
      expectNoActionIssue(maxValue(10), [Number.MIN_VALUE, 0, 10]);
    });

    test('for valid non-numbers', () => {
      expectNoActionIssue(maxValue(120), [
        '-120',
        '',
        ' 119 ',
        '120',
        '120.0',
        false,
        true,
        -100n,
        0n,
        120n,
        new Date(-100),
        new Date(0),
        new Date(120),
      ]);

      expectNoActionIssue(maxValue(0), [
        '',
        '-0',
        '-0.5',
        false,
        -120n,
        0n,
        new Date(-12),
        new Date(0),
      ]);

      expectNoActionIssue(maxValue(-50), [
        '-51',
        '-50.5',
        ' -50 ',
        -100n,
        -50n,
        new Date(-121),
        new Date(-50),
      ]);
    });

    test('for valid strings', () => {
      expectNoActionIssue(maxValue('2024'), ['', '1234', '2024']);
    });

    test('for valid non-strings', () => {
      expectNoActionIssue(maxValue('2018'), [
        -Infinity,
        -1,
        0,
        2000,
        2018,
        2018.0,
        false,
        true,
        -225n,
        0n,
        2018n,
        new Date(-101),
        new Date(0),
        new Date(2018),
      ]);

      expectNoActionIssue(maxValue('0'), [
        -Infinity,
        -0,
        false,
        -1n,
        0n,
        new Date(-10),
        new Date(0),
      ]);

      expectNoActionIssue(maxValue('-7000'), [
        -Infinity,
        -7000,
        -8123n,
        -7000n,
        new Date(-10000),
        new Date(-7000),
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
        maxValue(-100n, 'message'),
        { ...baseInfo, expected: '<=-100', requirement: -100n },
        [
          'nan',
          '- 100',
          '-100px',
          '',
          ' ',
          '-99',
          ' -99 ',
          '-101.0',
          -99,
          0,
          100,
          Infinity,
          NaN,
          false,
          true,
          new Date(-99),
          new Date(0),
          new Date(100),
        ],
        getReceived
      );

      expectActionIssue(
        maxValue(0n, 'message'),
        { ...baseInfo, expected: '<=0', requirement: 0n },
        [
          'nan',
          '0px',
          '0.5',
          '-0.5',
          0.75,
          1,
          Infinity,
          NaN,
          true,
          new Date(1),
        ],
        getReceived
      );

      expectActionIssue(
        maxValue(75n, 'message'),
        { ...baseInfo, expected: '<=75', requirement: 75n },
        ['nan', '75vw', ' 75.5 ', 75.5, 76, Infinity, NaN, new Date(80)],
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
        [
          'nan',
          '- 0',
          '0rem',
          '0.5',
          '1',
          ' 1 ',
          '1.0',
          0.5,
          1,
          Infinity,
          NaN,
          1n,
          new Date(1),
        ],
        getReceived
      );

      expectActionIssue(
        maxValue(true, 'message'),
        { ...baseInfo, expected: '<=true', requirement: true },
        [
          'nan',
          '+ 1',
          '1em',
          '1.5',
          '10',
          ' 10 ',
          '10.0',
          1.5,
          10,
          Infinity,
          NaN,
          2n,
          new Date(3),
        ],
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
      const date1 = new Date(100);
      expectActionIssue(
        maxValue(date1, 'message'),
        { ...baseInfo, expected: `<=${date1.toJSON()}`, requirement: date1 },
        [
          'nan',
          '- 100',
          '100$',
          '100.5',
          '105',
          100.5,
          101,
          Infinity,
          NaN,
          101n,
          1000n,
        ],
        getReceived
      );

      const date2 = new Date(-105);
      expectActionIssue(
        maxValue(date2, 'message'),
        { ...baseInfo, expected: `<=${date2.toJSON()}`, requirement: date2 },
        [
          'nan',
          '- 105',
          '-105deg',
          '-104',
          ' ',
          '105',
          '1050',
          -104.25,
          -0,
          105,
          Infinity,
          NaN,
          false,
          true,
          -104n,
          0n,
          105n,
        ],
        getReceived
      );

      const date3 = new Date(0);
      expectActionIssue(
        maxValue(date3, 'message'),
        { ...baseInfo, expected: `<=${date3.toJSON()}`, requirement: date3 },
        [
          'nan',
          '- 0',
          '0.5',
          '1',
          ' 1 ',
          '1.',
          0.5,
          10,
          Infinity,
          NaN,
          true,
          1n,
          10n,
        ],
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
        maxValue(-10, 'message'),
        { ...baseInfo, expected: '<=-10', requirement: -10 },
        [
          'nan',
          '-10ch',
          '- 10',
          '-9',
          ' -9 ',
          '-9.0',
          '',
          '-0',
          false,
          true,
          -9n,
          -0n,
          new Date(-9),
          new Date(0),
        ],
        getReceived
      );

      expectActionIssue(
        maxValue(0, 'message'),
        { ...baseInfo, expected: '<=0', requirement: 0 },
        ['nan', '0px', '+ 0', true, 1n, new Date(1)],
        getReceived
      );

      expectActionIssue(
        maxValue(21, 'message'),
        { ...baseInfo, expected: '<=21', requirement: 21 },
        ['nan', '- 21', '21.25', '25', 22n, new Date(30)],
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
        maxValue('-20', 'message'),
        { ...baseInfo, expected: '<="-20"', requirement: '-20' },
        [
          -19,
          -19.5,
          0,
          Infinity,
          NaN,
          false,
          true,
          -19n,
          0n,
          new Date(-19),
          new Date(0),
        ],
        getReceived
      );

      expectActionIssue(
        maxValue('0', 'message'),
        { ...baseInfo, expected: '<="0"', requirement: '0' },
        [0.75, 12, Infinity, NaN, true, 1n, new Date(10)],
        getReceived
      );

      expectActionIssue(
        maxValue('42', 'message'),
        { ...baseInfo, expected: '<="42"', requirement: '42' },
        [42.5, 102, Infinity, NaN, 45n, new Date(50)],
        getReceived
      );
    });
  });
});
