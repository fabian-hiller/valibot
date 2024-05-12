import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { value, type ValueAction } from './value.ts';

describe('value', () => {
  describe('should return action object', () => {
    const baseAction: Omit<ValueAction<number, 5, never>, 'message'> = {
      kind: 'validation',
      type: 'value',
      reference: value,
      expects: '5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: ValueAction<number, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(value(5)).toStrictEqual(action);
      expect(value(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(value(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies ValueAction<number, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(value(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies ValueAction<number, 5, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for untyped inputs', () => {
      expect(value(1)._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid bigints', () => {
      expectNoActionIssue(value(12n), [12n, BigInt(12), BigInt('12')]);
    });

    // Not sure if this is the expected behavior, but the current implementation allows it.
    // Type arguments are passed to make each test case's purpose clear.
    test('for values of data types other than bigint that are considered valid bigint values', () => {
      expectNoActionIssue(
        value<bigint | number, bigint | number>(12n),
        [12, 12.0]
      );
      expectNoActionIssue(value<bigint | true, bigint | true>(1n), [true]);
      expectNoActionIssue(value<bigint | false, bigint | false>(0n), [false]);
      expectNoActionIssue(value<bigint | string, bigint | string>(12n), [
        '12',
        ' 12',
        '12 ',
        ' 12 ',
      ]);
      expectNoActionIssue(value<bigint | Date, bigint | Date>(0n), [
        new Date(0),
      ]);
    });

    test('for valid booleans', () => {
      expectNoActionIssue(value(true), [true]);
      expectNoActionIssue(value(false), [false]);
    });

    // Not sure if this is the expected behavior, but the current implementation allows it.
    // Type arguments are passed to make each test case's purpose clear.
    test('for values of data types other than boolean that are considered valid boolean values', () => {
      expectNoActionIssue(value<true | number, true | number>(true), [1, 1.0]);
      expectNoActionIssue(value<true | bigint, true | bigint>(true), [
        1n,
        BigInt(1),
        BigInt('1'),
      ]);
      expectNoActionIssue(value<true | string, true | string>(true), [
        '1',
        ' 1',
        '1 ',
        ' 1 ',
      ]);
      expectNoActionIssue(value<true | Date, true | Date>(true), [new Date(1)]);
      expectNoActionIssue(
        value<false | number, false | number>(false),
        [0, 0.0]
      );
      expectNoActionIssue(value<false | bigint, false | bigint>(false), [
        0n,
        BigInt(0),
        BigInt('0'),
      ]);
      expectNoActionIssue(value<false | string, false | string>(false), [
        '',
        ' ',
        '\n',
        '\n\t',
      ]);
    });

    test('for valid dates', () => {
      const date = new Date();
      expectNoActionIssue(value(date), [
        date,
        new Date(date.getTime()),
        new Date(date.toISOString()),
        new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
          date.getMilliseconds()
        ),
      ]);
    });

    // Not sure if this is the expected behavior, but the current implementation allows it.
    // Type arguments are passed to make each test case's purpose clear.
    test('for values of data types other than Date that are considered valid Date values', () => {
      expectNoActionIssue(value<Date | true, Date | true>(new Date(1)), [true]);
      expectNoActionIssue(value<Date | false, Date | false>(new Date(0)), [
        false,
      ]);
      expectNoActionIssue(value<Date | bigint, Date | bigint>(new Date(12)), [
        12n,
        BigInt(12),
        BigInt('12'),
      ]);
      expectNoActionIssue(value<Date | string, Date | string>(new Date(12)), [
        '12',
        ' 12',
        '12 ',
        '   12   ',
        '12.0',
      ]);
    });

    test('for valid numbers', () => {
      expectNoActionIssue(value(12), [12, 12.0]);
    });

    // Not sure if this is the expected behavior, but the current implementation allows it.
    // Type arguments are passed to make each test case's purpose clear.
    test('for values of data types other than number that are considered valid number values', () => {
      expectNoActionIssue(value<number | true, number | true>(1), [true]);
      expectNoActionIssue(value<number | false, number | false>(0), [false]);
      expectNoActionIssue(value<number | bigint, number | bigint>(12), [
        12n,
        BigInt(12),
        BigInt('12'),
      ]);
      expectNoActionIssue(value<number | string, number | string>(12), [
        '12',
        ' 12',
        '12 ',
        '   12   ',
        '12.0',
      ]);
      expectNoActionIssue(value<number | Date, number | Date>(12), [
        new Date(12),
      ]);
    });

    test('for valid strings', () => {
      expectNoActionIssue(value('2024'), ['2024']);
    });

    // Not sure if this is the expected behavior, but the current implementation allows it.
    // Type arguments are passed to make each test case's purpose clear.
    test('for values of data types other than string that are considered valid string values', () => {
      expectNoActionIssue(value<string | true, string | true>('1'), [true]);
      expectNoActionIssue(value<string | false, string | false>('0'), [false]);
      expectNoActionIssue(
        value<string | number, string | number>(' 12 '),
        [12, 12.0]
      );
      expectNoActionIssue(value<string | bigint, string | bigint>(' 12 '), [
        12n,
        BigInt(12),
        BigInt('12'),
      ]);
      expectNoActionIssue(value<string | Date, string | Date>(' 12 '), [
        new Date(12),
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const baseInfo = {
      kind: 'validation',
      type: 'value',
      message: 'message',
    } as const;

    test('for invalid bigints', () => {
      expectActionIssue(
        value(10n, 'message'),
        { ...baseInfo, expected: '10', requirement: 10n },
        [11n, 9999n]
      );
    });

    /*
      Although the data types of the values under comparison are different, 
      there are cases where the current implementation considers them equal. 
      So add some test cases for the negatives.
    */
    test('for values of data types other than bigint that are considered invalid bigint values', () => {
      // Use a map to avoid leaking implementation details.
      const inputToReceived = new Map<
        string | number | bigint | boolean | Date,
        string
      >([
        [9, '9'],
        [10.01, '10.01'],
        [11, '11'],
        ['9', '"9"'],
        ['10.01', '"10.01"'],
        ['11', '"11"'],
        [true, 'true'],
        [false, 'false'],
        [new Date(9), '1970-01-01T00:00:00.009Z'],
        [new Date(11), '1970-01-01T00:00:00.011Z'],
      ]);

      expectActionIssue(
        value(10n, 'message'),
        { ...baseInfo, expected: '10', requirement: 10n },
        // Always make sure the values passed to the function are the keys of the `inputToReceived` map.
        [...inputToReceived.keys()],
        (value) => inputToReceived.get(value)!
      );
    });

    test('for invalid booleans', () => {
      expectActionIssue(
        value(false, 'message'),
        { ...baseInfo, expected: 'false', requirement: false },
        [true]
      );

      expectActionIssue(
        value(true, 'message'),
        { ...baseInfo, expected: 'true', requirement: true },
        [false]
      );
    });

    test('for values of data types other than boolean that are considered invalid boolean values', () => {
      // Use a map to avoid leaking implementation details.
      const inputToReceived = new Map<
        string | number | bigint | boolean | Date,
        string
      >([
        [-1, '-1'],
        [0, '0'],
        [2, '2'],
        [-1n, '-1'],
        [0n, '0'],
        [2n, '2'],
        ['-1', '"-1"'],
        ['0', '"0"'],
        [' ', '" "'],
        ['2', '"2"'],
        [new Date(-1), '1969-12-31T23:59:59.999Z'],
        [new Date(0), '1970-01-01T00:00:00.000Z'],
        [new Date(2), '1970-01-01T00:00:00.002Z'],
      ]);

      expectActionIssue(
        value(true, 'message'),
        { ...baseInfo, expected: 'true', requirement: true },
        // Always make sure the values passed to the function are the keys of the `inputToReceived` map.
        [...inputToReceived.keys()],
        (value) => inputToReceived.get(value)!
      );
    });

    test('for invalid dates', () => {
      const date = new Date();
      expectActionIssue(
        value<Date, Date, 'message'>(date, 'message'),
        { ...baseInfo, expected: `${date.toJSON()}`, requirement: date },
        [new Date(+date - 1), new Date(+date + 1), new Date(+date + 999999)],
        (value) => value.toJSON()
      );
    });

    test('for values of data types other than Date that are considered invalid Date values', () => {
      // Use a map to avoid leaking implementation details.
      const inputToReceived = new Map<
        string | number | bigint | boolean | Date,
        string
      >([
        [-1, '-1'],
        [0, '0'],
        [3, '3'],
        [-1n, '-1'],
        [0n, '0'],
        [3n, '3'],
        ['-1', '"-1"'],
        ['0', '"0"'],
        [' ', '" "'],
        ['3', '"3"'],
        [true, 'true'],
        [false, 'false'],
      ]);

      expectActionIssue(
        value(new Date(2), 'message'),
        {
          ...baseInfo,
          expected: '1970-01-01T00:00:00.002Z',
          requirement: new Date(2),
        },
        // Always make sure the values passed to the function are the keys of the `inputToReceived` map.
        [...inputToReceived.keys()],
        (value) => inputToReceived.get(value)!
      );
    });

    test('for invalid numbers', () => {
      expectActionIssue(
        value(10, 'message'),
        { ...baseInfo, expected: '10', requirement: 10 },
        [
          -Infinity,
          Number.MIN_VALUE,
          -10,
          -9,
          11,
          9999,
          Number.MAX_VALUE,
          Infinity,
          NaN,
        ]
      );
    });

    test('for values of data types other than number that are considered invalid number values', () => {
      // Use a map to avoid leaking implementation details.
      const inputToReceived = new Map<
        string | number | bigint | boolean | Date,
        string
      >([
        [-1n, '-1'],
        [0n, '0'],
        [3n, '3'],
        ['-1', '"-1"'],
        ['0', '"0"'],
        [' ', '" "'],
        ['3', '"3"'],
        [true, 'true'],
        [false, 'false'],
        [new Date(-1), '1969-12-31T23:59:59.999Z'],
        [new Date(3), '1970-01-01T00:00:00.003Z'],
      ]);
      expectActionIssue(
        value(2, 'message'),
        { ...baseInfo, expected: '2', requirement: 2 },
        // Always make sure the values passed to the function are the keys of the `inputToReceived` map.
        [...inputToReceived.keys()],
        (value) => inputToReceived.get(value)!
      );
    });

    test('for invalid strings', () => {
      expectActionIssue(
        value('2024', 'message'),
        { ...baseInfo, expected: '"2024"', requirement: '2024' },
        [
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
        ]
      );
    });

    test('for values of data types other than string that are considered invalid string values', () => {
      // Use a map to avoid leaking implementation details.
      const inputToReceived = new Map<
        string | number | bigint | boolean | Date,
        string
      >([
        [-1n, '-1'],
        [0n, '0'],
        [3n, '3'],
        [-1, '-1'],
        [0, '0'],
        [3, '3'],
        [true, 'true'],
        [false, 'false'],
        [new Date(-1), '1969-12-31T23:59:59.999Z'],
        [new Date(3), '1970-01-01T00:00:00.003Z'],
      ]);
      expectActionIssue(
        value('2', 'message'),
        { ...baseInfo, expected: '"2"', requirement: '2' },
        // Always make sure the values passed to the function are the keys of the `inputToReceived` map.
        [...inputToReceived.keys()],
        (value) => inputToReceived.get(value)!
      );
    });
  });
});
