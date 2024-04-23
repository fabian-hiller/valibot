import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { some, type SomeAction, type SomeIssue } from './some.ts';

describe('some', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = SomeAction<string[], undefined>;
      expectTypeOf(
        some<string[]>((element: string) => Boolean(element))
      ).toEqualTypeOf<Action>();
      expectTypeOf(
        some<string[], undefined>(
          (element: string) => Boolean(element),
          undefined
        )
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        some<string[], 'message'>(
          (element: string) => Boolean(element),
          'message'
        )
      ).toEqualTypeOf<SomeAction<string[], 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        some<string[], () => string>(
          (element: string) => Boolean(element),
          () => 'message'
        )
      ).toEqualTypeOf<SomeAction<string[], () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = ['foo', 123, true];
    type Action = SomeAction<Input, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<SomeIssue<Input>>();
    });
  });
});
