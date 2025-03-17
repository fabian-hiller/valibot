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

  test('should transform all keys of an object containing no duplicate keys', () => {
    const action = toSnakeCaseKeys();
    expect(
      action['~run'](
        {
          typed: true,
          value: {
            321: '321',
            foo: 'foo',
            'HELLO WORLD': 'HELLO WORLD',
            toURL: 'toURL',
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
        hello_world: 'HELLO WORLD',
        to_url: 'toURL',
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
  test('should transform all keys of an object containing duplicate keys', () => {
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
          },
        },
        {}
      )
    ).toStrictEqual({
      typed: true,
      value: {
        foo_bar: 'fooBar',
        hello_world: 'Hello World',
      },
    });
  });

  test('should transform selected keys of an object containing no duplicate keys', () => {
    const input = {
      toURL: 'toURL',
      'kebab-case': 'kebab-case',
      UPPER_SNAKE_CASE: 'UPPER_SNAKE_CASE',
    };
    const action = toSnakeCaseKeys<typeof input, ['toURL', 'UPPER_SNAKE_CASE']>(
      ['toURL', 'UPPER_SNAKE_CASE']
    );
    expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual({
      typed: true,
      value: {
        to_url: 'toURL',
        'kebab-case': 'kebab-case',
        upper_snake_case: 'UPPER_SNAKE_CASE',
      },
    });
  });

  test('should transform selected keys of an object containing duplicate keys', () => {
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
