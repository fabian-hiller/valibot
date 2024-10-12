import { describe, expect, test } from 'vitest';
import type { NumberIssue } from '../../schemas/index.ts';
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
      '~validate': expect.any(Function),
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
        minValue(1)['~validate']({ typed: false, value: null, issues }, {})
      ).toStrictEqual({ typed: false, value: null, issues });
    });

    test('for valid bigints', () => {
      expectNoActionIssue(minValue(10n), [10n, 11n, 9999n]);
    });

    test('for valid non-bigints', () => {
      expectNoActionIssue(minValue(10n), [
        '+10',
        ' 10 ',
        '15',
        10,
        10.0,
        13,
        Infinity,
        new Date(10),
        new Date(20),
      ]);

      expectNoActionIssue(minValue(1n), [
        '1',
        '+1',
        ' 3 ',
        1,
        1.5,
        12,
        Infinity,
        true,
        new Date(1),
        new Date(5),
      ]);

      expectNoActionIssue(minValue(0n), [
        '',
        ' ',
        '0',
        ' 15 ',
        0,
        -0,
        0.5,
        10,
        Infinity,
        false,
        true,
        new Date(0),
        new Date(5),
      ]);
    });

    test('for valid booleans', () => {
      expectNoActionIssue(minValue(false), [false, true]);
      expectNoActionIssue(minValue(true), [true]);
    });

    test('for valid non-booleans', () => {
      expectNoActionIssue(minValue(true), [
        '1',
        '+1',
        '1.0',
        ' 3 ',
        1,
        1.5,
        12,
        Infinity,
        new Date(1),
        new Date(5),
        1n,
        4n,
      ]);

      expectNoActionIssue(minValue(false), [
        '',
        ' ',
        '0',
        '0.0',
        ' 15 ',
        0,
        -0,
        0.5,
        10,
        Infinity,
        new Date(0),
        new Date(5),
        0n,
        4n,
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
      expectNoActionIssue(minValue(new Date(10)), [
        '+10',
        '10.0',
        ' 10 ',
        '15',
        10,
        10.0,
        13,
        Infinity,
        10n,
        12n,
      ]);

      expectNoActionIssue(minValue(new Date(1)), [
        '1',
        '+1',
        '1.0',
        ' 3 ',
        1,
        1.5,
        12,
        Infinity,
        true,
        1n,
        4n,
      ]);

      expectNoActionIssue(minValue(new Date(0)), [
        '',
        ' ',
        '0',
        '0.0',
        ' 15 ',
        0,
        -0,
        0.5,
        10,
        Infinity,
        false,
        true,
        0n,
        4n,
      ]);
    });

    test('for valid numbers', () => {
      expectNoActionIssue(minValue(10), [10, 11, 9999, Number.MAX_VALUE]);
    });

    test('for valid non-numbers', () => {
      expectNoActionIssue(minValue(10), [
        '+10',
        '10.0',
        ' 10 ',
        '15',
        new Date(10),
        new Date(20),
        10n,
        12n,
      ]);

      expectNoActionIssue(minValue(1), [
        '1',
        '+1',
        '1.0',
        ' 3 ',
        true,
        new Date(1),
        new Date(5),
        1n,
        4n,
      ]);

      expectNoActionIssue(minValue(0), [
        '',
        ' ',
        '0',
        '-0',
        '0.0',
        ' 15 ',
        false,
        true,
        new Date(0),
        new Date(5),
        0n,
        4n,
      ]);
    });

    test('for valid strings', () => {
      expectNoActionIssue(minValue('2024'), ['2024', '2025', '9999', 'XYZ']);
    });

    test('for valid non-strings', () => {
      expectNoActionIssue(minValue('10'), [
        10,
        10.0,
        13,
        Infinity,
        new Date(10),
        new Date(20),
        10n,
        12n,
      ]);

      expectNoActionIssue(minValue('1'), [
        1,
        1.0,
        1.5,
        12,
        Infinity,
        true,
        new Date(1),
        new Date(5),
        1n,
        4n,
      ]);

      expectNoActionIssue(minValue('0'), [
        0,
        -0,
        0.0,
        0.5,
        10,
        Infinity,
        false,
        true,
        new Date(0),
        new Date(5),
        0n,
        4n,
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
        minValue(123n, 'message'),
        { ...baseInfo, expected: '>=123', requirement: 123n },
        [
          'nan',
          '123px',
          '+ 123',
          '-124',
          '-123',
          '',
          ' ',
          '0.0',
          ' 122 ',
          '123.0',
          -124,
          -123,
          0,
          122,
          122.5,
          NaN,
          false,
          true,
          new Date(-124),
          new Date(-123),
          new Date(0),
          new Date(122),
        ],
        getReceived
      );

      expectActionIssue(
        minValue(1n, 'message'),
        { ...baseInfo, expected: '>=1', requirement: 1n },
        [
          'nan',
          '1px',
          '+ 1',
          '-2',
          '-1',
          '',
          ' ',
          '0',
          ' 0.5 ',
          '1.0',
          -2,
          -1,
          0,
          0.5,
          NaN,
          false,
          new Date(-2),
          new Date(-1),
          new Date(0),
        ],
        getReceived
      );

      expectActionIssue(
        minValue(0n, 'message'),
        { ...baseInfo, expected: '>=0', requirement: 0n },
        [
          'nan',
          '0px',
          '+ 0',
          '-0.5',
          '-1',
          ' -1 ',
          '0.0',
          -1,
          -0.5,
          NaN,
          new Date(-1),
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
          '0px',
          '+ 0',
          '-0.5',
          '-1',
          ' -1 ',
          -1,
          -0.5,
          NaN,
          new Date(-1),
          -1n,
        ],
        getReceived
      );

      expectActionIssue(
        minValue(true, 'message'),
        { ...baseInfo, expected: '>=true', requirement: true },
        [
          'nan',
          '1px',
          '+ 1',
          '-2',
          '-1',
          '',
          ' ',
          '0',
          ' 0.5 ',
          -2,
          -1,
          0,
          0.5,
          NaN,
          new Date(-2),
          new Date(-1),
          new Date(0),
          -2n,
          -1n,
          0n,
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
      const date1 = new Date(123);
      expectActionIssue(
        minValue(date1, 'message'),
        { ...baseInfo, expected: `>=${date1.toJSON()}`, requirement: date1 },
        [
          'nan',
          '123px',
          '+ 123',
          '-124',
          '-123',
          '',
          ' ',
          '0.0',
          ' 122 ',
          -124,
          -123,
          0,
          122,
          122.5,
          NaN,
          false,
          true,
          -124n,
          -123n,
          0n,
          122n,
        ],
        getReceived
      );

      const date2 = new Date(1);
      expectActionIssue(
        minValue(date2, 'message'),
        { ...baseInfo, expected: `>=${date2.toJSON()}`, requirement: date2 },
        [
          'nan',
          '1px',
          '+ 1',
          '-2',
          '-1',
          '',
          ' ',
          '0',
          ' 0.5 ',
          -2,
          -1,
          0,
          0.5,
          NaN,
          false,
          -2n,
          -1n,
          0n,
        ],
        getReceived
      );

      const date3 = new Date(0);
      expectActionIssue(
        minValue(date3, 'message'),
        { ...baseInfo, expected: `>=${date3.toJSON()}`, requirement: date3 },
        ['nan', '0px', '+ 0', '-0.5', '-1', ' -1 ', -1, -0.5, NaN, -1n],
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
        minValue(123, 'message'),
        { ...baseInfo, expected: '>=123', requirement: 123 },
        [
          'nan',
          '123px',
          '+ 123',
          '-124',
          '-123',
          '',
          ' ',
          '0.0',
          ' 122 ',
          false,
          true,
          new Date(-124),
          new Date(-123),
          new Date(0),
          new Date(122),
          -124n,
          -123n,
          0n,
          122n,
        ],
        getReceived
      );

      expectActionIssue(
        minValue(1, 'message'),
        { ...baseInfo, expected: '>=1', requirement: 1 },
        [
          'nan',
          '1px',
          '+ 1',
          '-2',
          '-1',
          '',
          ' ',
          '0',
          ' 0.5 ',
          false,
          new Date(-2),
          new Date(-1),
          new Date(0),
          -2n,
          -1n,
          0n,
        ],
        getReceived
      );

      expectActionIssue(
        minValue(0, 'message'),
        { ...baseInfo, expected: '>=0', requirement: 0 },
        ['nan', '0px', '+ 0', '-0.5', '-1', ' -1 ', new Date(-1), -1n],
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
        minValue('123', 'message'),
        { ...baseInfo, expected: '>="123"', requirement: '123' },
        [
          -124,
          -123,
          0,
          122,
          122.5,
          NaN,
          false,
          true,
          new Date(-124),
          new Date(-123),
          new Date(0),
          new Date(122),
          -124n,
          -123n,
          0n,
          122n,
        ],
        getReceived
      );

      expectActionIssue(
        minValue('1', 'message'),
        { ...baseInfo, expected: '>="1"', requirement: '1' },
        [
          -2,
          -1,
          0,
          0.5,
          NaN,
          false,
          new Date(-2),
          new Date(-1),
          new Date(0),
          -2n,
          -1n,
          0n,
        ],
        getReceived
      );

      expectActionIssue(
        minValue('0', 'message'),
        { ...baseInfo, expected: '>="0"', requirement: '0' },
        [-1, -0.5, NaN, new Date(-1), -1n],
        getReceived
      );
    });
  });
});
