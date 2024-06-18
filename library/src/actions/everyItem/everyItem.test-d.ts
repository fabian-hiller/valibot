import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  everyItem,
  type EveryItemAction,
  type EveryItemIssue,
} from './everyItem.ts';

describe('everyItem', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = EveryItemAction<string[], undefined>;
      expectTypeOf(
        everyItem<string[]>((item: string) => Boolean(item))
      ).toEqualTypeOf<Action>();
      expectTypeOf(
        everyItem<string[], undefined>(
          (item: string) => Boolean(item),
          undefined
        )
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        everyItem<string[], 'message'>(
          (item: string) => Boolean(item),
          'message'
        )
      ).toEqualTypeOf<EveryItemAction<string[], 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        everyItem<string[], () => string>(
          (item: string) => Boolean(item),
          () => 'message'
        )
      ).toEqualTypeOf<EveryItemAction<string[], () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = ['foo', 123, true];
    type Action = EveryItemAction<Input, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<EveryItemIssue<Input>>();
    });
  });
});
