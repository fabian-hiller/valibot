import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  toCamelCaseKeys,
  type ToCamelCaseKeysAction,
} from './toCamelCaseKeys.ts';

describe('toCamelCaseKeys', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Input = {
    // numeric
    321: '321';
    // standard
    foo: 'foo';
    'hello world': 'hello world';
    HELLOWORLD: 'HELLOWORLD';
    camelCase?: 'camelCase';
    toURL: 'toURL';
    readonly PascalCase: 'PascalCase';
    'kebab-case'?: 'kebab-case';
    UPPER_SNAKE_CASE: 'UPPER_SNAKE_CASE';
    // edge cases
    '': '';
    '  hi  bye  ': '  hi  bye  ';
    __LEFT__right__: '__LEFT__right__';
    '--up--DOWN--': '--up--DOWN--';
    readonly '..leftDiagonal..rightDiagonal..'?: '..leftDiagonal..rightDiagonal..';
    'U R L': 'U R L';
    'I ❤️ valibot': 'I ❤️ valibot';
    a_å: 'a_å';
    iC: 'iC';
    IC: 'IC';
  };

  type ActionWithoutSelection = ToCamelCaseKeysAction<Input, undefined>;
  type ActionWithSelection = ToCamelCaseKeysAction<
    Input,
    [
      'foo',
      'HELLOWORLD',
      'toURL',
      'PascalCase',
      'kebab-case',
      '  hi  bye  ',
      '__LEFT__right__',
      '..leftDiagonal..rightDiagonal..',
      'I ❤️ valibot',
    ]
  >;

  describe('should return action object', () => {
    test('with no selected keys', () => {
      expectTypeOf(
        toCamelCaseKeys<Input>()
      ).toEqualTypeOf<ActionWithoutSelection>();
    });

    test('with selected keys', () => {
      expectTypeOf(
        toCamelCaseKeys<
          Input,
          [
            'foo',
            'HELLOWORLD',
            'toURL',
            'PascalCase',
            'kebab-case',
            '  hi  bye  ',
            '__LEFT__right__',
            '..leftDiagonal..rightDiagonal..',
            'I ❤️ valibot',
          ]
        >([
          'foo',
          'HELLOWORLD',
          'toURL',
          'PascalCase',
          'kebab-case',
          '  hi  bye  ',
          '__LEFT__right__',
          '..leftDiagonal..rightDiagonal..',
          'I ❤️ valibot',
        ])
      ).toEqualTypeOf<ActionWithSelection>();
    });
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<ActionWithoutSelection>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<ActionWithSelection>>().toEqualTypeOf<Input>();
    });

    describe('of output', () => {
      test('with no duplicate keys', () => {
        expectTypeOf<InferOutput<ActionWithoutSelection>>().toEqualTypeOf<{
          321: '321';
          foo: 'foo';
          helloWorld: 'hello world';
          helloworld: 'HELLOWORLD';
          camelCase?: 'camelCase';
          toUrl: 'toURL';
          readonly pascalCase: 'PascalCase';
          kebabCase?: 'kebab-case';
          upperSnakeCase: 'UPPER_SNAKE_CASE';
          '': '';
          hiBye: '  hi  bye  ';
          leftRight: '__LEFT__right__';
          upDown: '--up--DOWN--';
          readonly leftDiagonalRightDiagonal?: '..leftDiagonal..rightDiagonal..';
          uRL: 'U R L';
          'i❤️Valibot': 'I ❤️ valibot';
          aÅ: 'a_å';
          iC: 'iC';
          ic: 'IC';
        }>();
        expectTypeOf<InferOutput<ActionWithSelection>>().toEqualTypeOf<{
          321: '321';
          foo: 'foo';
          'hello world': 'hello world';
          helloworld: 'HELLOWORLD';
          camelCase?: 'camelCase';
          toUrl: 'toURL';
          readonly pascalCase: 'PascalCase';
          kebabCase?: 'kebab-case';
          UPPER_SNAKE_CASE: 'UPPER_SNAKE_CASE';
          '': '';
          hiBye: '  hi  bye  ';
          leftRight: '__LEFT__right__';
          '--up--DOWN--': '--up--DOWN--';
          readonly leftDiagonalRightDiagonal?: '..leftDiagonal..rightDiagonal..';
          'U R L': 'U R L';
          'i❤️Valibot': 'I ❤️ valibot';
          a_å: 'a_å';
          iC: 'iC';
          IC: 'IC';
        }>();
      });

      test('with duplicate keys', () => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
        type InputWithDuplicates = {
          fooBar: 'fooBar';
          foo_bar: 'foo_bar';
          'Hello World': 'Hello World';
          'HELLO WORLD': 'HELLO WORLD';
          'hello world': 'hello world';
        };

        expectTypeOf<
          InferOutput<ToCamelCaseKeysAction<InputWithDuplicates, undefined>>
        >().toEqualTypeOf<{
          fooBar: 'fooBar' | 'foo_bar';
          helloWorld: 'hello world' | 'HELLO WORLD' | 'Hello World';
        }>();
        expectTypeOf<
          InferOutput<
            ToCamelCaseKeysAction<
              InputWithDuplicates,
              ['foo_bar', 'Hello World', 'hello world']
            >
          >
        >().toEqualTypeOf<{
          fooBar: 'foo_bar' | 'fooBar';
          'HELLO WORLD': 'HELLO WORLD';
          helloWorld: 'hello world' | 'Hello World';
        }>();
      });

      test('with whitespace keys', () => {
        expectTypeOf<
          InferOutput<
            ToCamelCaseKeysAction<
              {
                '\t': '\t';
                '\v': '\v';
                '\f': '\f';
                ' ': ' ';
                '\u00A0': '\u00A0';
                '\uFEFF': '\uFEFF';
                '\u1680': '\u1680';
                '\u2000': '\u2000';
                '\u2001': '\u2001';
                '\u2002': '\u2002';
                '\u2003': '\u2003';
                '\u2004': '\u2004';
                '\u2005': '\u2005';
                '\u2006': '\u2006';
                '\u2007': '\u2007';
                '\u2008': '\u2008';
                '\u2009': '\u2009';
                '\u200A': '\u200A';
                '\u202F': '\u202F';
                '\u205F': '\u205F';
                '\u3000': '\u3000';
                '\n': '\n';
                '\r': '\r';
                '\u2028': '\u2028';
                '\u2029': '\u2029';
              },
              undefined
            >
          >
        >().toEqualTypeOf<{
          '':
            | '\t'
            | '\v'
            | '\f'
            | ' '
            | '\u00A0'
            | '\uFEFF'
            | '\u1680'
            | '\u2000'
            | '\u2001'
            | '\u2002'
            | '\u2003'
            | '\u2004'
            | '\u2005'
            | '\u2006'
            | '\u2007'
            | '\u2008'
            | '\u2009'
            | '\u200A'
            | '\u202F'
            | '\u205F'
            | '\u3000'
            | '\n'
            | '\r'
            | '\u2028'
            | '\u2029';
        }>();
      });
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<ActionWithoutSelection>>().toEqualTypeOf<never>();
      expectTypeOf<InferIssue<ActionWithSelection>>().toEqualTypeOf<never>();
    });
  });
});
