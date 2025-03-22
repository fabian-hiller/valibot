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
    'hello world': 'hello world';
    'HELLO WORLDD': 'HELLO WORLDD';
    toURL: 'toURL';
    PascalCase: 'PascalCase';
    'kebab-case': 'kebab-case';
    UPPER_SNAKE_CASE: 'UPPER_SNAKE_CASE';
    // edge cases
    '  hi  bye  ': '  hi  bye  ';
    __LEFT__right__: '__LEFT__right__';
    '--up--DOWN--': '--up--DOWN--';
    '..leftDiagonal..rightDiagonal..': '..leftDiagonal..rightDiagonal..';
    'U R L': 'U R L';
    'I ❤️ valibot': 'I ❤️ valibot';
    aÅ: 'aÅ';
    IC: 'IC';
  };

  type ActionWithoutSelection = ToSnakeCaseKeysAction<Input, undefined>;

  type ActionWithSelection = ToSnakeCaseKeysAction<
    Input,
    [
      'HELLO WORLDD',
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
        toSnakeCaseKeys<Input>()
      ).toEqualTypeOf<ActionWithoutSelection>();
    });

    test('with selected keys', () => {
      expectTypeOf(
        toSnakeCaseKeys<
          Input,
          [
            'HELLO WORLDD',
            'toURL',
            'PascalCase',
            'kebab-case',
            '  hi  bye  ',
            '__LEFT__right__',
            '..leftDiagonal..rightDiagonal..',
            'I ❤️ valibot',
          ]
        >([
          'HELLO WORLDD',
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
      test('having no duplicates', () => {
        expectTypeOf<InferOutput<ActionWithoutSelection>>().toEqualTypeOf<{
          321: '321';
          hello_world: 'hello world';
          hello_worldd: 'HELLO WORLDD';
          to_url: 'toURL';
          pascal_case: 'PascalCase';
          kebab_case: 'kebab-case';
          upper_snake_case: 'UPPER_SNAKE_CASE';
          hi_bye: '  hi  bye  ';
          left_right: '__LEFT__right__';
          up_down: '--up--DOWN--';
          left_diagonal_right_diagonal: '..leftDiagonal..rightDiagonal..';
          u_r_l: 'U R L';
          'i_❤️_valibot': 'I ❤️ valibot';
          a_å: 'aÅ';
          ic: 'IC';
        }>();
        expectTypeOf<InferOutput<ActionWithSelection>>().toEqualTypeOf<{
          321: '321';
          'hello world': 'hello world';
          hello_worldd: 'HELLO WORLDD';
          to_url: 'toURL';
          pascal_case: 'PascalCase';
          kebab_case: 'kebab-case';
          UPPER_SNAKE_CASE: 'UPPER_SNAKE_CASE';
          hi_bye: '  hi  bye  ';
          left_right: '__LEFT__right__';
          '--up--DOWN--': '--up--DOWN--';
          left_diagonal_right_diagonal: '..leftDiagonal..rightDiagonal..';
          'U R L': 'U R L';
          'i_❤️_valibot': 'I ❤️ valibot';
          aÅ: 'aÅ';
          IC: 'IC';
        }>();
      });

      describe('having string duplicates', () => {
        test('with no modifiers', () => {
          // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
          type InputWithDuplicates = {
            foo_bar: 'foo_bar';
            fooBar: 'fooBar';
            'hello world': 'hello world';
            'Hello World': 'Hello World';
            hello_World: 'hello_World';
          };

          expectTypeOf<
            InferOutput<ToSnakeCaseKeysAction<InputWithDuplicates, undefined>>
          >().toEqualTypeOf<{
            foo_bar: 'fooBar' | 'foo_bar';
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
            foo_bar: 'foo_bar' | 'fooBar';
            'hello world': 'hello world';
            hello_world: 'Hello World' | 'hello_World';
          }>();
        });

        test('with optional modifiers', () => {
          // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
          type InputWithDuplicates = {
            foo_bar?: 'foo_bar';
            fooBar?: 'fooBar';
            'hello world'?: 'hello world';
            'Hello World'?: 'Hello World';
            hello_World?: 'hello_World';
          };

          expectTypeOf<
            InferOutput<ToSnakeCaseKeysAction<InputWithDuplicates, undefined>>
          >().toEqualTypeOf<{
            foo_bar?: 'fooBar' | 'foo_bar';
            hello_world?: 'hello world' | 'Hello World' | 'hello_World';
          }>();

          expectTypeOf<
            InferOutput<
              ToSnakeCaseKeysAction<
                InputWithDuplicates,
                ['fooBar', 'Hello World', 'hello_World']
              >
            >
          >().toEqualTypeOf<{
            foo_bar?: 'foo_bar' | 'fooBar';
            'hello world'?: 'hello world';
            hello_world?: 'Hello World' | 'hello_World';
          }>();
        });

        test('with optional modifiers except for one duplicate', () => {
          // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
          type InputWithDuplicates = {
            foo_bar: 'foo_bar';
            fooBar?: 'fooBar';
            'hello world'?: 'hello world';
            'Hello World': 'Hello World';
            hello_World?: 'hello_World';
          };

          expectTypeOf<
            InferOutput<ToSnakeCaseKeysAction<InputWithDuplicates, undefined>>
          >().toEqualTypeOf<{
            foo_bar: 'fooBar' | 'foo_bar';
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
            foo_bar: 'foo_bar' | 'fooBar';
            'hello world'?: 'hello world';
            hello_world: 'Hello World' | 'hello_World';
          }>();
        });

        test('with at least one readonly duplicate', () => {
          // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
          type InputWithDuplicates = {
            readonly foo_bar: 'foo_bar';
            fooBar: 'fooBar';
            'hello world': 'hello world';
            'Hello World': 'Hello World';
            readonly hello_World: 'hello_World';
          };

          expectTypeOf<
            InferOutput<ToSnakeCaseKeysAction<InputWithDuplicates, undefined>>
          >().toEqualTypeOf<{
            readonly foo_bar: 'fooBar' | 'foo_bar';
            readonly hello_world: 'hello world' | 'Hello World' | 'hello_World';
          }>();

          expectTypeOf<
            InferOutput<
              ToSnakeCaseKeysAction<
                InputWithDuplicates,
                ['fooBar', 'Hello World', 'hello_World']
              >
            >
          >().toEqualTypeOf<{
            readonly foo_bar: 'foo_bar' | 'fooBar';
            'hello world': 'hello world';
            readonly hello_world: 'Hello World' | 'hello_World';
          }>();
        });

        test('with all optional and at least one readonly duplicate', () => {
          // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
          type InputWithDuplicates = {
            readonly foo_bar?: 'foo_bar';
            fooBar?: 'fooBar';
            'hello world'?: 'hello world';
            'Hello World'?: 'Hello World';
            readonly hello_World?: 'hello_World';
          };

          expectTypeOf<
            InferOutput<ToSnakeCaseKeysAction<InputWithDuplicates, undefined>>
          >().toEqualTypeOf<{
            readonly foo_bar?: 'fooBar' | 'foo_bar';
            readonly hello_world?:
              | 'hello world'
              | 'Hello World'
              | 'hello_World';
          }>();

          expectTypeOf<
            InferOutput<
              ToSnakeCaseKeysAction<
                InputWithDuplicates,
                ['fooBar', 'Hello World', 'hello_World']
              >
            >
          >().toEqualTypeOf<{
            readonly foo_bar?: 'foo_bar' | 'fooBar';
            'hello world'?: 'hello world';
            readonly hello_world?: 'Hello World' | 'hello_World';
          }>();
        });
      });

      test('having a number duplicate', () => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
        type InputWithDuplicates = {
          123: 123;
          ' 123 ': ' 123 ';
        };

        expectTypeOf<
          InferOutput<ToSnakeCaseKeysAction<InputWithDuplicates, undefined>>
        >().toEqualTypeOf<never>();

        expectTypeOf<
          InferOutput<ToSnakeCaseKeysAction<InputWithDuplicates, [' 123 ']>>
        >().toEqualTypeOf<never>();
      });

      test('having whitespace keys', () => {
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
