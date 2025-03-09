import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  toSnakeCaseKeys,
  type ToSnakeCaseKeysAction,
} from './toSnakeCaseKeys.ts';

describe('toSnakeCaseKeys', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Input = {
    // numeric
    321: '321';
    // standard
    foo: 'foo';
    'Hello World': 'Hello World';
    camelCase?: 'camelCase';
    readonly PascalCase: 'PascalCase';
    readonly 'kebab-case'?: 'kebab-case';
    UPPER_SNAKE_CASE: 'UPPER_SNAKE_CASE';
    // edge cases
    '   ': '   ';
    '   test   '?: '   test   ';
    readonly __init__: '__init__';
    readonly 'I ❤️ valibot'?: 'I ❤️ valibot';
    'MixOf Styles': 'MixOf Styles';
    aÅ: 'aÅ';
    'object.key': 'object.key';
    '---ABC--DEF---': '---ABC--DEF---';
  };

  type ActionWithoutSelection = ToSnakeCaseKeysAction<Input, undefined>;
  type ActionWithSelection = ToSnakeCaseKeysAction<
    Input,
    [
      'foo',
      'Hello World',
      'camelCase',
      'PascalCase',
      'kebab-case',
      '   test   ',
      '__init__',
      'object.key',
      'I ❤️ valibot',
    ]
  >;

  describe('should return action object', () => {
    test('with no selected keys', () => {
      expectTypeOf(
        toSnakeCaseKeys<Input>()
      ).toEqualTypeOf<ActionWithoutSelection>();
    });

    test('with selected keys', () => {
      expectTypeOf(
        toSnakeCaseKeys<
          Input,
          [
            'foo',
            'Hello World',
            'camelCase',
            'PascalCase',
            'kebab-case',
            '   test   ',
            '__init__',
            'object.key',
            'I ❤️ valibot',
          ]
        >([
          'foo',
          'Hello World',
          'camelCase',
          'PascalCase',
          'kebab-case',
          '   test   ',
          '__init__',
          'object.key',
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
          hello_world: 'Hello World';
          camel_case?: 'camelCase';
          readonly pascal_case: 'PascalCase';
          readonly kebab_case?: 'kebab-case';
          upper_snake_case: 'UPPER_SNAKE_CASE';
          '': '   ';
          test?: '   test   ';
          readonly init: '__init__';
          readonly 'i_❤️_valibot'?: 'I ❤️ valibot';
          mix_of_styles: 'MixOf Styles';
          a_å: 'aÅ';
          object_key: 'object.key';
          abc_def: '---ABC--DEF---';
        }>();
        expectTypeOf<InferOutput<ActionWithSelection>>().toEqualTypeOf<{
          321: '321';
          foo: 'foo';
          hello_world: 'Hello World';
          camel_case?: 'camelCase';
          readonly pascal_case: 'PascalCase';
          readonly kebab_case?: 'kebab-case';
          UPPER_SNAKE_CASE: 'UPPER_SNAKE_CASE';
          '   ': '   ';
          test?: '   test   ';
          readonly init: '__init__';
          readonly 'i_❤️_valibot'?: 'I ❤️ valibot';
          'MixOf Styles': 'MixOf Styles';
          aÅ: 'aÅ';
          object_key: 'object.key';
          '---ABC--DEF---': '---ABC--DEF---';
        }>();
      });

      test('with duplicate keys', () => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
        type InputWithDuplicates = {
          foo: 'foo';
          foo_bar: 'foo_bar';
          fooBar: 'fooBar';
          'hello world': 'hello world';
          'Hello World': 'Hello World';
          hello_World: 'hello_World';
        };

        expectTypeOf<
          InferOutput<ToSnakeCaseKeysAction<InputWithDuplicates, undefined>>
        >().toEqualTypeOf<{
          foo: 'foo';
          foo_bar: 'foo_bar' | 'fooBar';
          hello_world: 'hello world' | 'Hello World' | 'hello_World';
        }>();
        expectTypeOf<
          InferOutput<
            ToSnakeCaseKeysAction<
              InputWithDuplicates,
              ['fooBar', 'Hello World', 'hello_World']
            >
          >
        >().toEqualTypeOf<{
          foo: 'foo';
          foo_bar: 'foo_bar' | 'fooBar';
          'hello world': 'hello world';
          hello_world: 'Hello World' | 'hello_World';
        }>();
      });

      test('with whitespace keys', () => {
        expectTypeOf<
          InferOutput<
            ToSnakeCaseKeysAction<
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
