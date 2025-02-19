import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types';
import { toSnakeCase, type ToSnakeCaseAction } from './toSnakeCase.ts';

describe('toSnakeCase', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Input = {
    // numeric key
    321: '321';
    foo: 'foo';
    // standard cases
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

  type ActionWithoutSelection = ToSnakeCaseAction<Input, undefined>;
  type ActionWithSelection = ToSnakeCaseAction<
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
        toSnakeCase<Input>()
      ).toEqualTypeOf<ActionWithoutSelection>();
    });

    test('with selected keys', () => {
      expectTypeOf(
        toSnakeCase<
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
          InferOutput<ToSnakeCaseAction<InputWithDuplicates, undefined>>
        >().toEqualTypeOf<{
          foo: 'foo';
          foo_bar: 'foo_bar' | 'fooBar';
          hello_world: 'hello world' | 'Hello World' | 'hello_World';
        }>();
        expectTypeOf<
          InferOutput<
            ToSnakeCaseAction<
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
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<ActionWithoutSelection>>().toEqualTypeOf<never>();
      expectTypeOf<InferIssue<ActionWithSelection>>().toEqualTypeOf<never>();
    });
  });
});
