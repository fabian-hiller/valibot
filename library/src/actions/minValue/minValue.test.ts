import { describe, expect, test } from 'vitest';
import { _stringify } from '../../utils/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { minValue, type MinValueAction } from './minValue.ts';

describe('minValue', () => {
  describe('should return action object', () => {
    const baseAction: Omit<MinValueAction<number, 5, never>, 'message'> = {
      kind: 'validation',
      type: 'min_value',
      reference: minValue,
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

  describe('should return dataset without issues', () => {
    test('for untyped inputs', () => {
      expect(minValue(1)._run({ typed: false, value: null }, {})).toStrictEqual(
        { typed: false, value: null }
      );
    });

    test('for valid bigints', () => {
      expectNoActionIssue(minValue(10n), [10n, 11n, 9999n]);
    });

    test('for valid non-bigints', () => {
      expectNoActionIssue(minValue(123n), [
        '123',
        '+123',
        ' 123 ',
        '200',
        Infinity,
        123,
        123.0,
        1024,
        new Date(123),
        new Date(256),
      ]);

      expectNoActionIssue(minValue(0n), [
        '',
        ' ',
        '0',
        ' 15 ',
        0.5,
        -0,
        10,
        Infinity,
        false,
        true,
        new Date(0),
        new Date(12),
      ]);

      expectNoActionIssue(minValue(-21n), [
        '-15',
        ' -21 ',
        -21,
        -20.5,
        Infinity,
        false,
        true,
        new Date(-21),
        new Date(0),
      ]);
    });

    test('for valid booleans', () => {
      expectNoActionIssue(minValue(false), [false, true]);
      expectNoActionIssue(minValue(true), [true]);
    });

    test('for valid non-booleans', () => {
      expectNoActionIssue(minValue(true), [
        '1',
        ' 1 ',
        '1.0',
        '2',
        Infinity,
        1,
        1.0,
        3,
        1n,
        5n,
        new Date(1),
        new Date(10),
      ]);

      expectNoActionIssue(minValue(false), [
        '',
        ' ',
        '0',
        ' 0 ',
        '0.',
        '1',
        Infinity,
        -0,
        2,
        0.0,
        0n,
        3n,
        new Date(0),
        new Date(5),
      ]);
    });

    test('for valid dates', () => {
      const date = new Date();
      expectNoActionIssue(minValue(date), [
        date,
        new Date(+date + 1),
        new Date(+date + 999999),
      ]);
    });

    test('for valid non-dates', () => {
      const date1 = new Date(101);
      expectNoActionIssue(minValue(date1), [
        '101',
        ' 101 ',
        '101.0',
        '103',
        101,
        101.0,
        105,
        date1.getTime(),
        Infinity,
        101n,
        110n,
      ]);

      const date2 = new Date(-1);
      expectNoActionIssue(minValue(date2), [
        '-0.5',
        '-1',
        ' -1 ',
        '-1.',
        -1,
        -1.0,
        0,
        date2.getTime(),
        Infinity,
        false,
        true,
        -1n,
        0n,
      ]);

      const date3 = new Date(0);
      expectNoActionIssue(minValue(date3), [
        '',
        ' ',
        '0',
        ' 0 ',
        '0.',
        -0,
        0.0,
        date3.getTime(),
        Infinity,
        false,
        true,
        0n,
        15n,
      ]);
    });

    test('for valid numbers', () => {
      expectNoActionIssue(minValue(10), [10, 11, 9999, Number.MAX_VALUE]);
    });

    test('for valid non-numbers', () => {
      expectNoActionIssue(minValue(120), [
        '120',
        '+120',
        ' 120 ',
        '120.0',
        '256',
        120n,
        217n,
        new Date(120),
        new Date(515),
      ]);

      expectNoActionIssue(minValue(0), [
        '',
        ' ',
        '0.',
        ' -0 ',
        '12',
        false,
        true,
        0n,
        3n,
        new Date(0),
        new Date(100),
      ]);

      expectNoActionIssue(minValue(-50), [
        '-50',
        ' -50 ',
        '-48',
        '',
        false,
        true,
        -50n,
        -35n,
        0n,
        new Date(-50),
        new Date(0),
      ]);
    });

    test('for valid strings', () => {
      expectNoActionIssue(minValue('2024'), ['2024', '2025', '9999', 'XYZ']);
    });

    test('for valid non-strings', () => {
      expectNoActionIssue(minValue('2018'), [
        2018,
        2018.0,
        5001,
        Infinity,
        2018n,
        3000n,
        new Date(2018),
        new Date(2020),
      ]);

      expectNoActionIssue(minValue('0'), [
        0,
        -0,
        Infinity,
        false,
        true,
        0n,
        1n,
        5n,
        new Date(0),
        new Date(12),
      ]);

      expectNoActionIssue(minValue('-7000'), [
        -7000,
        Infinity,
        false,
        true,
        -6999n,
        -7000n,
        0n,
        new Date(-7000),
        new Date(0),
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const baseInfo = {
      kind: 'validation',
      type: 'min_value',
      message: 'message',
    } as const;

    const getReceived = (value: unknown): string =>
      value instanceof Date ? value.toJSON() : _stringify(value);

    test('for invalid bigints', () => {
      expectActionIssue(
        minValue(10n, 'message'),
        { ...baseInfo, expected: '>=10', requirement: 10n },
        [-9999n, 0n, 9n]
      );
    });

    test('for invalid non-bigints', () => {
      expectActionIssue(
        minValue(-100n, 'message'),
        { ...baseInfo, expected: '>=-100', requirement: -100n },
        [
          'nan',
          '- 100',
          '-100px',
          '-101',
          ' -101 ',
          '-100.',
          -101,
          -Infinity,
          -1000,
          NaN,
          new Date(-101),
          new Date(-200),
        ],
        getReceived
      );

      expectActionIssue(
        minValue(0n, 'message'),
        { ...baseInfo, expected: '>=0', requirement: 0n },
        [
          'nan',
          '0px',
          '0.',
          ' -1 ',
          -1,
          -0.25,
          -Infinity,
          NaN,
          new Date(-1),
          new Date(-100),
        ],
        getReceived
      );

      expectActionIssue(
        minValue(75n, 'message'),
        { ...baseInfo, expected: '>=75', requirement: 75n },
        [
          'nan',
          '75vw',
          ' 75. ',
          '12',
          0,
          70,
          74.5,
          -Infinity,
          NaN,
          false,
          true,
          new Date(0),
          new Date(74),
        ],
        getReceived
      );
    });

    test('for invalid booleans', () => {
      expectActionIssue(
        minValue(true, 'message'),
        { ...baseInfo, expected: '>=true', requirement: true },
        [false]
      );
    });

    test('for invalid non-booleans', () => {
      expectActionIssue(
        minValue(false, 'message'),
        { ...baseInfo, expected: '>=false', requirement: false },
        [
          'nan',
          '- 0',
          '0rem',
          '-0.5',
          ' -1 ',
          -0.25,
          -1,
          -5,
          -Infinity,
          NaN,
          -1n,
          -12n,
          new Date(-1),
          new Date(-100),
        ],
        getReceived
      );

      expectActionIssue(
        minValue(true, 'message'),
        { ...baseInfo, expected: '>=true', requirement: true },
        [
          'nan',
          '+ 1',
          '1em',
          '',
          ' ',
          '0',
          '-0.5',
          '-10',
          -0,
          -1,
          -0.5,
          -Infinity,
          NaN,
          0n,
          -12n,
          new Date(0),
          new Date(-15),
        ],
        getReceived
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

    test('for invalid non-dates', () => {
      const date1 = new Date(100);
      expectActionIssue(
        minValue(date1, 'message'),
        { ...baseInfo, expected: `>=${date1.toJSON()}`, requirement: date1 },
        [
          'nan',
          '+ 100',
          '100$',
          '',
          '99.5',
          '98',
          99.5,
          95,
          -Infinity,
          NaN,
          false,
          true,
          0n,
          99n,
        ],
        getReceived
      );

      const date2 = new Date(-105);
      expectActionIssue(
        minValue(date2, 'message'),
        { ...baseInfo, expected: `>=${date2.toJSON()}`, requirement: date2 },
        [
          'nan',
          '- 105',
          '-105deg',
          ' -106 ',
          '-105.5',
          -105.25,
          -108,
          -Infinity,
          NaN,
          -106n,
          -1000n,
        ],
        getReceived
      );

      const date3 = new Date(0);
      expectActionIssue(
        minValue(date3, 'message'),
        { ...baseInfo, expected: `>=${date3.toJSON()}`, requirement: date3 },
        [
          'nan',
          '+ 0',
          '-0.5',
          '-1',
          ' -1 ',
          '-1.',
          -0.25,
          -1,
          -Infinity,
          NaN,
          -1n,
          -5n,
        ],
        getReceived
      );
    });

    test('for invalid numbers', () => {
      expectActionIssue(
        minValue(10, 'message'),
        { ...baseInfo, expected: '>=10', requirement: 10 },
        [Number.MIN_VALUE, 0, 9]
      );
    });

    test('for invalid non-numbers', () => {
      expectActionIssue(
        minValue(-10, 'message'),
        { ...baseInfo, expected: '>=-10', requirement: -10 },
        [
          'nan',
          '-10ch',
          '- 10',
          '-10.5',
          ' -11 ',
          '-11.0',
          -11n,
          -100n,
          new Date(-11),
          new Date(-212),
        ],
        getReceived
      );

      expectActionIssue(
        minValue(0, 'message'),
        { ...baseInfo, expected: '>=0', requirement: 0 },
        ['nan', '0px', '+ 0', '-0.5', ' -1 ', '-1.0', -1n, -10n, new Date(-1)],
        getReceived
      );

      expectActionIssue(
        minValue(21, 'message'),
        { ...baseInfo, expected: '>=21', requirement: 21 },
        [
          'nan',
          '+ 21',
          '-21',
          '',
          '20.5',
          '10',
          -21n,
          15n,
          20n,
          false,
          true,
          new Date(0),
          new Date(20),
        ],
        getReceived
      );
    });

    test('for invalid strings', () => {
      expectActionIssue(
        minValue('2024', 'message'),
        { ...baseInfo, expected: '>="2024"', requirement: '2024' },
        ['', '1234', '2023']
      );
    });

    test('for invalid non-strings', () => {
      expectActionIssue(
        minValue('-20', 'message'),
        { ...baseInfo, expected: '>="-20"', requirement: '-20' },
        [-20.5, -21, -Infinity, NaN, -21n, -100n, new Date(-21), new Date(-35)],
        getReceived
      );

      expectActionIssue(
        minValue('0', 'message'),
        { ...baseInfo, expected: '>="0"', requirement: '0' },
        [-0.5, -1, -Infinity, NaN, -1n, -10n, new Date(-1), new Date(-100)],
        getReceived
      );

      expectActionIssue(
        minValue('42', 'message'),
        { ...baseInfo, expected: '>="42"', requirement: '42' },
        [
          41.5,
          0,
          -42,
          -Infinity,
          NaN,
          41n,
          0n,
          -42n,
          false,
          true,
          new Date(41),
          new Date(-42),
        ],
        getReceived
      );
    });
  });
});
