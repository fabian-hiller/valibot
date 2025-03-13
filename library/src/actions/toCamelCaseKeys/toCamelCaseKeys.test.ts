import { describe, expect, test } from 'vitest';
import {
  toCamelCaseKeys,
  type ToCamelCaseKeysAction,
} from './toCamelCaseKeys.ts';

describe('toCamelCaseKeys', () => {
  describe('should return action object', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    type Input = {
      1: boolean;
      foo: boolean;
      foo_bar: boolean;
      hello_world: boolean;
    };

    test('with no selected keys', () => {
      expect(toCamelCaseKeys<Input>()).toStrictEqual({
        kind: 'transformation',
        type: 'to_camel_case_keys',
        reference: toCamelCaseKeys,
        async: false,
        selectedKeys: undefined,
        '~run': expect.any(Function),
      } satisfies ToCamelCaseKeysAction<Input, undefined>);
    });

    test('with selected keys', () => {
      expect(toCamelCaseKeys<Input, ['foo_bar']>(['foo_bar'])).toStrictEqual({
        kind: 'transformation',
        type: 'to_camel_case_keys',
        reference: toCamelCaseKeys,
        async: false,
        selectedKeys: ['foo_bar'],
        '~run': expect.any(Function),
      } satisfies ToCamelCaseKeysAction<Input, ['foo_bar']>);
    });
  });

  test('should transform all keys', () => {
    const action = toCamelCaseKeys();
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
        helloWorld: 'HELLO WORLD',
        toUrl: 'toURL',
        pascalCase: 'PascalCase',
        kebabCase: 'kebab-case',
        upperSnakeCase: 'UPPER_SNAKE_CASE',
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
    const action = toCamelCaseKeys();
    expect(
      action['~run'](
        {
          typed: true,
          value: {
            fooBar: 'fooBar',
            foo_bar: 'foo_bar',
            'HELLO WORLD': 'HELLO WORLD',
            'hello world': 'hello world',
          },
        },
        {}
      )
    ).toStrictEqual({
      typed: true,
      value: {
        fooBar: 'foo_bar',
        helloWorld: 'hello world',
      },
    });
  });

  test('should transform selected keys', () => {
    const input = {
      toURL: 'toURL',
      'kebab-case': 'kebab-case',
      UPPER_SNAKE_CASE: 'UPPER_SNAKE_CASE',
    };
    const action = toCamelCaseKeys<typeof input, ['toURL', 'UPPER_SNAKE_CASE']>(
      ['toURL', 'UPPER_SNAKE_CASE']
    );
    expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual({
      typed: true,
      value: {
        toUrl: 'toURL',
        'kebab-case': 'kebab-case',
        upperSnakeCase: 'UPPER_SNAKE_CASE',
      },
    });
  });

  test('should handle duplicate keys properly when transforming selected keys', () => {
    const input = {
      fooBar: 'fooBar',
      foo_bar: 'foo_bar',
      'Hello World': 'Hello World',
      'HELLO WORLD': 'HELLO WORLD',
      'hello world': 'hello world',
    };
    const action = toCamelCaseKeys<
      typeof input,
      ['foo_bar', 'Hello World', 'hello world']
    >(['foo_bar', 'Hello World', 'hello world']);
    expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual({
      typed: true,
      value: {
        fooBar: 'foo_bar',
        helloWorld: 'hello world',
        'HELLO WORLD': 'HELLO WORLD',
      },
    });
  });
});
