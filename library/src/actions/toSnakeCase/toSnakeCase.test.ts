import { describe, expect, test } from 'vitest';
import { toSnakeCase, type ToSnakeCaseAction } from './toSnakeCase.ts';

describe('toSnakeCase', () => {
  test('should return action object', () => {
    expect(toSnakeCase()).toStrictEqual({
      kind: 'transformation',
      type: 'to_snake_case',
      reference: toSnakeCase,
      async: false,
      '~run': expect.any(Function),
    } satisfies ToSnakeCaseAction);
  });

  describe('should transform to snake case', () => {
    const action = toSnakeCase();
    const expectNoMismatch = (values: [input: string, expected: string][]) => {
      for (const [input, expected] of values) {
        expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual(
          {
            typed: true,
            value: expected,
          }
        );
      }
    };

    test('when the input is empty or contains only whitespaces', () => {
      expectNoMismatch([['', '']]);
      expectNoMismatch([
        ['\t', ''],
        ['\v', ''],
        ['\f', ''],
        [' ', ''],
        ['\u00A0', ''],
        ['\uFEFF', ''],
        ['\u1680', ''],
        ['\u2000', ''],
        ['\u2001', ''],
        ['\u2002', ''],
        ['\u2003', ''],
        ['\u2004', ''],
        ['\u2005', ''],
        ['\u2006', ''],
        ['\u2007', ''],
        ['\u2008', ''],
        ['\u2009', ''],
        ['\u200A', ''],
        ['\u202F', ''],
        ['\u205F', ''],
        ['\u3000', ''],
        ['\n', ''],
        ['\r', ''],
        ['\u2028', ''],
        ['\u2029', ''],
      ]);
    });

    test('when the input belongs to a commonly used case', () => {
      expectNoMismatch([
        ['hello world', 'hello_world'], // lower case
        ['HELLO WORLD', 'hello_world'], // upper case
        ['camelCase', 'camel_case'], // camel case
        ['toURL', 'to_url'], // camel case with an acronym
        ['PascalCase', 'pascal_case'], // pascal case
        ['kebab-case', 'kebab_case'], // kebab case
        ['snake_case', 'snake_case'], // snake case
        ['UPPER_SNAKE_CASE', 'upper_snake_case'], // upper snake case
      ]);
    });

    test('when the input is any valid string', () => {
      expectNoMismatch([
        ['  hi  bye  ', 'hi_bye'],
        ['__LEFT__right__', 'left_right'],
        ['--up--DOWN--', 'up_down'],
        ['..leftDiagonal..rightDiagonal..', 'left_diagonal_right_diagonal'],
        ['U R L', 'u_r_l'],
        ['I ❤️ valibot', 'i_❤️_valibot'],
        ['aÅ', 'a_å'],
        ['iC', 'i_c'],
        ['IC', 'ic'],
      ]);
    });
  });
});
