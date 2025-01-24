import { describe, expect, test } from 'vitest';
import { toSnakeCase, type ToSnakeCaseAction } from './toSnakeCase.ts';

describe('toSnakeCase', () => {
  describe('should return action object', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    type Input = {
      1: boolean;
      foo: boolean;
      fooBar: boolean;
      helloWorld: boolean;
    };

    test('with no selected keys', () => {
      expect(toSnakeCase<Input>()).toStrictEqual({
        kind: 'transformation',
        type: 'to_snake_case',
        reference: toSnakeCase,
        async: false,
        selectedKeys: undefined,
        '~run': expect.any(Function),
      } satisfies ToSnakeCaseAction<Input, undefined>);
    });

    test('with selected keys', () => {
      expect(toSnakeCase<Input, ['fooBar']>(['fooBar'])).toStrictEqual({
        kind: 'transformation',
        type: 'to_snake_case',
        reference: toSnakeCase,
        async: false,
        selectedKeys: ['fooBar'],
        '~run': expect.any(Function),
      } satisfies ToSnakeCaseAction<Input, ['fooBar']>);
    });
  });

  describe('should transform', () => {
    test('all keys', () => {
      const action = toSnakeCase();
      expect(
        action['~run'](
          {
            typed: true,
            value: {
              321: '321',
              foo: 'foo',
              Foo: 'Foo',
              fooBar: 'fooBar',
              FooBar: 'FooBar',
              Foo_Bar: 'Foo_Bar',
              helloWorld: 'helloWorld',
              bar_foo: 'bar_foo',
            },
          },
          {}
        )
      ).toStrictEqual({
        typed: true,
        value: {
          321: '321',
          foo: 'foo',
          Foo: 'Foo',
          foo_bar: 'fooBar',
          Foo_bar: 'FooBar',
          Foo__bar: 'Foo_Bar',
          hello_world: 'helloWorld',
          bar_foo: 'bar_foo',
        },
      });
    });

    test('all keys expect those whose transforms are present', () => {
      const action = toSnakeCase();
      expect(
        action['~run'](
          {
            typed: true,
            value: {
              321: '321',
              fooBar: 'fooBar',
              foo_bar: 'foo_bar',
              helloWorld: 'helloWorld',
              barFoo: 'barFoo',
            },
          },
          {}
        )
      ).toStrictEqual({
        typed: true,
        value: {
          321: '321',
          foo_bar: 'foo_bar',
          hello_world: 'helloWorld',
          bar_foo: 'barFoo',
        },
      });
    });

    test('only the selected keys', () => {
      const input = {
        321: '321',
        foo: 'foo',
        fooBar: 'fooBar',
        FooBar: 'FooBar',
        helloWorld: 'helloWorld',
        bar_foo: 'bar_foo',
      };
      const action = toSnakeCase<typeof input, ['FooBar', 'helloWorld']>([
        'FooBar',
        'helloWorld',
      ]);
      expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual({
        typed: true,
        value: {
          321: '321',
          foo: 'foo',
          fooBar: 'fooBar',
          Foo_bar: 'FooBar',
          hello_world: 'helloWorld',
          bar_foo: 'bar_foo',
        },
      });
    });

    test('only the selected keys expect those whose transforms are present', () => {
      const input = {
        321: '321',
        foo: 'foo',
        fooBar: 'fooBar',
        helloWorld: 'helloWorld',
        hello_world: 'hello_world',
      };
      const action = toSnakeCase<typeof input, ['fooBar', 'helloWorld']>([
        'fooBar',
        'helloWorld',
      ]);
      expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual({
        typed: true,
        value: {
          321: '321',
          foo: 'foo',
          foo_bar: 'fooBar',
          hello_world: 'hello_world',
        },
      });
    });
  });
});
