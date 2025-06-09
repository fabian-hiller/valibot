import { describe, expect, test } from 'vitest';
import { toCamelCase, type ToCamelCaseAction } from './toCamelCase.ts';

describe('toCamelCase', () => {
  test('should return action object', () => {
    expect(toCamelCase()).toStrictEqual({
      kind: 'transformation',
      type: 'to_camel_case',
      reference: toCamelCase,
      async: false,
      '~run': expect.any(Function),
    } satisfies ToCamelCaseAction);
  });

  describe('should transform to camel case', () => {
    const action = toCamelCase();
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
        ['hello world', 'helloWorld'], // lower case
        ['HELLOWORLD', 'helloworld'], // upper case
        ['HELLO WORLD', 'helloWorld'], // upper case with a separator
        ['camelCase', 'camelCase'], // camel case
        ['toURL', 'toUrl'], // camel case with an acronym
        ['PascalCase', 'pascalCase'], // pascal case
        ['kebab-case', 'kebabCase'], // kebab case
        ['UPPER_SNAKE_CASE', 'upperSnakeCase'], // upper snake case
      ]);
    });

    test('when string is in any form', () => {
      expectNoMismatch([
        ['', ''],
        ['  hi  bye  ', 'hiBye'],
        ['__LEFT__right__', 'leftRight'],
        ['--up--DOWN--', 'upDown'],
        ['..leftDiagonal..rightDiagonal..', 'leftDiagonalRightDiagonal'],
        ['U R L', 'uRL'],
        ['I ❤️ valibot', 'i❤️Valibot'],
        ['a_å', 'aÅ'],
        ['iC', 'iC'],
        ['IC', 'ic'],
      ]);
    });
  });
});
