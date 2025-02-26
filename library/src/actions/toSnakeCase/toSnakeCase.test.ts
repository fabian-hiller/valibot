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

    test('when string is empty or contains only whitespace', () => {
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

    test('when form of the string belongs to a commonly used case', () => {
      expectNoMismatch([
        ['camelCase', 'camel_case'],
        ['PascalCase', 'pascal_case'],
        ['kebab-case', 'kebab_case'],
        ['UPPER_SNAKE_CASE', 'upper_snake_case'],
      ]);
    });

    test('when string is in any form', () => {
      expectNoMismatch([
        ['foo', 'foo'],
        ['Hello World', 'hello_world'],
        ['   test   ', 'test'],
        ['__init__', 'init'],
        ['i ❤️ valibot', 'i_❤️_valibot'],
        ['MixOf Styles', 'mix_of_styles'],
        ['aÅ', 'a_å'],
        ['object.key', 'object_key'],
        ['---ABC--DEF---', 'abc_def'],
      ]);
    });
  });
});
