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
            // numeric key
            321: '321',
            foo: 'foo',
            // standard cases
            'Hello World': 'Hello World',
            camelCase: 'camelCase',
            PascalCase: 'PascalCase',
            'kebab-case': 'kebab-case',
            UPPER_SNAKE_CASE: 'UPPER_SNAKE_CASE',
            // edge cases
            '   ': '   ',
            '   test   ': '   test   ',
            __init__: '__init__',
            'I ❤️ valibot': 'I ❤️ valibot',
            'MixOf Styles': 'MixOf Styles',
            aÅ: 'aÅ',
            'object.key': 'object.key',
            '---ABC--DEF---': '---ABC--DEF---',
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
        '': '   ',
        test: '   test   ',
        init: '__init__',
        'i_❤️_valibot': 'I ❤️ valibot',
        mix_of_styles: 'MixOf Styles',
        a_å: 'aÅ',
        object_key: 'object.key',
        abc_def: '---ABC--DEF---',
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
            '': '',
            '   ': '   ',
            _hello: '_hello',
            hello_: 'hello_',
          },
        },
        {}
      )
    ).toStrictEqual({
      typed: true,
      value: {
        foo_bar: 'fooBar',
        hello_world: 'hello_World',
        '': '   ',
        hello: 'hello_',
      },
    });
  });

  test('should transform selected keys', () => {
    const input = {
      // numeric key
      321: '321',
      foo: 'foo',
      // standard cases
      'Hello World': 'Hello World',
      camelCase: 'camelCase',
      PascalCase: 'PascalCase',
      'kebab-case': 'kebab-case',
      UPPER_SNAKE_CASE: 'UPPER_SNAKE_CASE',
      // edge cases
      '   ': '   ',
      '   test   ': '   test   ',
      __init__: '__init__',
      'I ❤️ valibot': 'I ❤️ valibot',
      'MixOf Styles': 'MixOf Styles',
      aÅ: 'aÅ',
      'object.key': 'object.key',
      '---ABC--DEF---': '---ABC--DEF---',
    };
    const action = toSnakeCaseKeys<
      typeof input,
      ['camelCase', 'kebab-case', '__init__', '---ABC--DEF---']
    >(['camelCase', 'kebab-case', '__init__', '---ABC--DEF---']);
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
        '   ': '   ',
        '   test   ': '   test   ',
        init: '__init__',
        'I ❤️ valibot': 'I ❤️ valibot',
        'MixOf Styles': 'MixOf Styles',
        aÅ: 'aÅ',
        'object.key': 'object.key',
        abc_def: '---ABC--DEF---',
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
      '': '',
      '   ': '   ',
      _hello: '_hello',
      hello_: 'hello_',
    };
    const action = toSnakeCaseKeys<
      typeof input,
      ['fooBar', 'Hello World', 'hello_World', '   ', 'hello_']
    >(['fooBar', 'Hello World', 'hello_World', '   ', 'hello_']);
    expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual({
      typed: true,
      value: {
        foo_bar: 'fooBar',
        'hello world': 'hello world',
        hello_world: 'hello_World',
        '': '   ',
        _hello: '_hello',
        hello: 'hello_',
      },
    });
  });
});
