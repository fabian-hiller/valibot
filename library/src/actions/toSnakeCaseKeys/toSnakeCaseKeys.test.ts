import { describe, expect, test } from 'vitest';
import {
  toSnakeCaseKeys,
  type ToSnakeCaseKeysAction,
} from './toSnakeCaseKeys.ts';

describe('toSnakeCaseKeys', () => {
  describe('should return action object', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    type Input = {
      1: boolean;
      foo: boolean;
      fooBar: boolean;
      helloWorld: boolean;
    };

    test('with no selected keys', () => {
      expect(toSnakeCaseKeys<Input>()).toStrictEqual({
        kind: 'transformation',
        type: 'to_snake_case_keys',
        reference: toSnakeCaseKeys,
        async: false,
        selectedKeys: undefined,
        '~run': expect.any(Function),
      } satisfies ToSnakeCaseKeysAction<Input, undefined>);
    });

    test('with selected keys', () => {
      expect(toSnakeCaseKeys<Input, ['fooBar']>(['fooBar'])).toStrictEqual({
        kind: 'transformation',
        type: 'to_snake_case_keys',
        reference: toSnakeCaseKeys,
        async: false,
        selectedKeys: ['fooBar'],
        '~run': expect.any(Function),
      } satisfies ToSnakeCaseKeysAction<Input, ['fooBar']>);
    });
  });

  test('should transform all keys', () => {
    const action = toSnakeCaseKeys();
    expect(
      action['~run'](
        {
          typed: true,
          value: {
            321: '321',
            foo: 'foo',
            'Hello World': 'Hello World',
            camelCase: 'camelCase',
            PascalCase: 'PascalCase',
            'kebab-case': 'kebab-case',
            UPPER_SNAKE_CASE: 'UPPER_SNAKE_CASE',
          },
        },
        {}
      )
    ).toStrictEqual({
      typed: true,
      value: {
        321: '321',
        foo: 'foo',
        hello_world: 'Hello World',
        camel_case: 'camelCase',
        pascal_case: 'PascalCase',
        kebab_case: 'kebab-case',
        upper_snake_case: 'UPPER_SNAKE_CASE',
      },
    });
  });

  /*
      hint:
        the latest key's value is stored when dealing with duplicate keys
      
      a key is said to be the latest if it appears at the end 
      while iterating over the object's keys using `Object.keys`
    */
  test('should handle duplicate keys properly when transforming all keys', () => {
    const action = toSnakeCaseKeys();
    expect(
      action['~run'](
        {
          typed: true,
          value: {
            foo_bar: 'foo_bar',
            fooBar: 'fooBar',
            'hello world': 'hello world',
            'Hello World': 'Hello World',
            hello_World: 'hello_World',
          },
        },
        {}
      )
    ).toStrictEqual({
      typed: true,
      value: {
        foo_bar: 'fooBar',
        hello_world: 'hello_World',
      },
    });
  });

  test('should transform selected keys', () => {
    const input = {
      321: '321',
      foo: 'foo',
      'Hello World': 'Hello World',
      camelCase: 'camelCase',
      PascalCase: 'PascalCase',
      'kebab-case': 'kebab-case',
      UPPER_SNAKE_CASE: 'UPPER_SNAKE_CASE',
    };
    const action = toSnakeCaseKeys<typeof input, ['camelCase', 'kebab-case']>([
      'camelCase',
      'kebab-case',
    ]);
    expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual({
      typed: true,
      value: {
        321: '321',
        foo: 'foo',
        'Hello World': 'Hello World',
        camel_case: 'camelCase',
        PascalCase: 'PascalCase',
        kebab_case: 'kebab-case',
        UPPER_SNAKE_CASE: 'UPPER_SNAKE_CASE',
      },
    });
  });

  test('should handle duplicate keys properly when transforming selected keys', () => {
    const input = {
      foo_bar: 'foo_bar',
      fooBar: 'fooBar',
      'hello world': 'hello world',
      'Hello World': 'Hello World',
      hello_World: 'hello_World',
    };
    const action = toSnakeCaseKeys<
      typeof input,
      ['fooBar', 'Hello World', 'hello_World']
    >(['fooBar', 'Hello World', 'hello_World']);
    expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual({
      typed: true,
      value: {
        foo_bar: 'fooBar',
        'hello world': 'hello world',
        hello_world: 'hello_World',
      },
    });
  });
});
