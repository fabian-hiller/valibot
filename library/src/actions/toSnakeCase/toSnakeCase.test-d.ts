import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types';
import type { SelectedStringKeys } from '../types.ts';
import { toSnakeCase, type ToSnakeCaseAction } from './toSnakeCase.ts';

describe('toSnakeCase', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Input = {
    1: '1';
    foo: 'foo';
    readonly helloWorld: 'helloWorld';
    fooBar: 'fooBar';
    foo_bar: 'foo_bar';
    A_b?: 'A_b';
    barFoo: 'barFoo';
  };

  type ActionWithoutSelection = ToSnakeCaseAction<Input, undefined>;
  type ActionWithSelection = ToSnakeCaseAction<
    Input,
    ['foo', 'helloWorld', 'fooBar']
  >;

  describe('should return action object', () => {
    test('with no selected keys', () => {
      expectTypeOf(
        toSnakeCase<Input>()
      ).toEqualTypeOf<ActionWithoutSelection>();
    });

    test('with selected keys', () => {
      expectTypeOf(
        toSnakeCase<Input, ['foo', 'helloWorld', 'fooBar']>([
          'foo',
          'helloWorld',
          'fooBar',
        ])
      ).toEqualTypeOf<ActionWithSelection>();
    });
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<ActionWithoutSelection>>().toEqualTypeOf<Input>();
      expectTypeOf<InferInput<ActionWithSelection>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<ActionWithoutSelection>>().toEqualTypeOf<{
        1: '1';
        foo: 'foo';
        readonly hello_world: 'helloWorld';
        foo_bar: 'foo_bar';
        A_b?: 'A_b';
        bar_foo: 'barFoo';
      }>();
      expectTypeOf<InferOutput<ActionWithSelection>>().toEqualTypeOf<{
        1: '1';
        foo: 'foo';
        readonly hello_world: 'helloWorld';
        foo_bar: 'foo_bar';
        A_b?: 'A_b';
        barFoo: 'barFoo';
      }>();
      expectTypeOf<
        InferOutput<ToSnakeCaseAction<Input, ['foo_bar', 'fooBar']>>
      >().toEqualTypeOf<{
        1: '1';
        foo: 'foo';
        readonly helloWorld: 'helloWorld';
        foo_bar: 'foo_bar';
        A_b?: 'A_b';
        barFoo: 'barFoo';
      }>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<ActionWithoutSelection>>().toEqualTypeOf<never>();
      expectTypeOf<InferIssue<ActionWithSelection>>().toEqualTypeOf<never>();
    });
  });

  test('should accept all of the valid tuples', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    type Input = { k1: boolean; k2: boolean; k3: boolean };
    expectTypeOf(
      toSnakeCase<Input, SelectedStringKeys<Input>>(['k1'])['selectedKeys']
    ).toEqualTypeOf<
      | ['k1']
      | ['k2']
      | ['k3']
      | ['k1', 'k2']
      | ['k1', 'k3']
      | ['k2', 'k3']
      | ['k2', 'k1']
      | ['k3', 'k1']
      | ['k3', 'k2']
      | ['k1', 'k2', 'k3']
      | ['k1', 'k3', 'k2']
      | ['k2', 'k1', 'k3']
      | ['k2', 'k3', 'k1']
      | ['k3', 'k1', 'k2']
      | ['k3', 'k2', 'k1']
    >();
  });
});
