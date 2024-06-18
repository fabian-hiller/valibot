import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  someItem,
  type SomeItemAction,
  type SomeItemIssue,
} from './someItem.ts';

describe('someItem', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = SomeItemAction<string[], undefined>;
      expectTypeOf(
        someItem<string[]>((item: string) => Boolean(item))
      ).toEqualTypeOf<Action>();
      expectTypeOf(
        someItem<string[], undefined>(
          (item: string) => Boolean(item),
          undefined
        )
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        someItem<string[], 'message'>(
          (item: string) => Boolean(item),
          'message'
        )
      ).toEqualTypeOf<SomeItemAction<string[], 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        someItem<string[], () => string>(
          (item: string) => Boolean(item),
          () => 'message'
        )
      ).toEqualTypeOf<SomeItemAction<string[], () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = ['foo', 123, true];
    type Action = SomeItemAction<Input, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<SomeItemIssue<Input>>();
    });
  });
});
